import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllTasksPage.css";

const AllTasksPage = ({ tasks, onSelectTask, userRole }) => {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [exchangeFilter, setExchangeFilter] = useState("All");
  const [byMeOnly, setByMeOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSummaryClick = (status) => setStatusFilter(status);

  const goToEditTask = (taskId) => {
    onSelectTask(taskId);
    navigate(`/task/${taskId}`);
  };

  const toggleExpand = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;
    const created = new Date(task.createdDate);
    const matchesFrom = dateFrom ? created >= new Date(dateFrom) : true;
    const matchesTo = dateTo ? created <= new Date(dateTo) : true;
    const matchesExchange =
      exchangeFilter === "All" ||
      Object.values(task.exchangeApprovals || {}).includes(exchangeFilter);
    const matchesByMe =
      !byMeOnly ||
      task.createdBy === "User" ||
      task.comments?.some((c) => c.author === "User");

    return (
      matchesSearch &&
      matchesStatus &&
      matchesFrom &&
      matchesTo &&
      matchesExchange &&
      matchesByMe
    );
  });

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const summaryCounts = {
    all: tasks.length,
    open: tasks.filter((t) => t.status === "Open").length,
    inReview: tasks.filter((t) => t.status === "In Review").length,
    approved: tasks.filter((t) => t.status === "Approved").length,
    rejected: tasks.filter((t) => t.status === "Rejected").length,
    expired: tasks.filter((t) => t.status === "Expired").length,
  };

  const getLatestComment = (task) => {
    const latestSubtask = task.subTasks?.[task.subTasks.length - 1];
    return (
      latestSubtask?.comments?.[latestSubtask.comments.length - 1]?.text ||
      "No comments"
    );
  };

  const getLastUpdated = (task) => {
    const latestSubtask = task.subTasks?.[task.subTasks.length - 1];
    const lastComment =
      latestSubtask?.comments?.[latestSubtask.comments.length - 1];
    return (
      lastComment?.timestamp || latestSubtask?.uploadedOn || task.createdDate
    );
  };

  const renderExchangeBadge = (status) => {
    if (status === "Approved")
      return <span className="badge green">🟩 Approved</span>;
    if (status === "Pending")
      return <span className="badge red">🟥 Pending</span>;
    if (status === "Not Sent")
      return <span className="badge grey">⬜ Not Sent</span>;
    return <span className="badge">—</span>;
  };

  return (
    <div className="dashboard-container">
      <h2>All Tasks</h2>

      <div className="dashboard-cards-row">
        {["All", "Open", "In Review", "Approved", "Rejected", "Expired"].map(
          (status) => (
            <div
              key={status}
              className={`summary-card ${
                statusFilter === status ? "active" : ""
              }`}
              onClick={() => handleSummaryClick(status)}
            >
              <div className="card-label">{status}</div>
              <div className="card-count">
                {status === "All" && summaryCounts.all}
                {status === "Open" && summaryCounts.open}
                {status === "In Review" && summaryCounts.inReview}
                {status === "Approved" && summaryCounts.approved}
                {status === "Rejected" && summaryCounts.rejected}
                {status === "Expired" && summaryCounts.expired}
              </div>
            </div>
          )
        )}
      </div>

      {/* 🔍 Filters */}
      <div className="filter-panel">
        <input
          type="text"
          placeholder="Search by Task Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <select
          value={exchangeFilter}
          onChange={(e) => setExchangeFilter(e.target.value)}
        >
          <option value="All">All Exchange Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Not Sent">Not Sent</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={byMeOnly}
            onChange={(e) => setByMeOnly(e.target.checked)}
          />{" "}
          By Me
        </label>
        <button
          onClick={() => {
            setSearchText("");
            setDateFrom("");
            setDateTo("");
            setStatusFilter("All");
            setExchangeFilter("All");
            setByMeOnly(false);
          }}
        >
          Clear Filters
        </button>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>UIN</th>
            <th>Task Name</th>
            <th>Created By</th>
            <th>Ad Type</th>
            <th>Status</th>
            <th>Exchange Status</th>
            <th>Current Version</th>
            <th>Created On</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTasks.length === 0 ? (
            <tr>
              <td colSpan="10">No tasks found.</td>
            </tr>
          ) : (
            paginatedTasks.map((task) => {
              const latestVersion =
                task.subTasks?.[task.subTasks.length - 1]?.version || "N/A";
              const exchangeStatus = task.exchangeApprovals || {};
              return (
                <React.Fragment key={task.id}>
                  <tr
                    className="clickable-row"
                    onClick={() => toggleExpand(task.id)}
                  >
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.createdBy || "—"}</td>
                    <td>{task.adType || "—"}</td>
                    <td>{task.status}</td>
                    <td>
                      {Object.entries(exchangeStatus).map(([ex, status]) => (
                        <div key={ex}>
                          {ex}: {renderExchangeBadge(status)}
                        </div>
                      ))}
                    </td>
                    <td>{latestVersion}</td>
                    <td>{task.createdDate}</td>
                    <td>{getLastUpdated(task)}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToEditTask(task.id);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>

                  {expandedTaskId === task.id && (
                    <tr className="expanded-row">
                      <td colSpan="10">
                        <strong>Latest Comment:</strong>{" "}
                        {getLatestComment(task)}
                        <br />
                        <strong>Files:</strong>{" "}
                        {task.files?.map((f) => f.name).join(", ") ||
                          "No files"}
                        <br />
                        <button onClick={() => goToEditTask(task.id)}>
                          Go to Task
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>

      {/* 🔻 Pagination */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default AllTasksPage;
