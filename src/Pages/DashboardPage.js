import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import AddTaskModal from "../components/AddTaskModal";

const DashboardPage = ({ tasks, addTask, onSelectTask, userRole }) => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const summary = {
    completed: tasks.filter((t) =>
      ["Advertised", "Expired"].includes(t.status)
    ),
    reviewer: tasks.filter((t) => t.status === "In Review"),
    performer: tasks.filter((t) => t.status === "Pending"),
  };

  const closeModal = () => setActiveModal(null);

  const toggleExpand = (taskId) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;
    const createdDate = new Date(task.createdDate);
    const matchesFrom = dateFrom ? createdDate >= new Date(dateFrom) : true;
    const matchesTo = dateTo ? createdDate <= new Date(dateTo) : true;
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  const getModalTasks = () => {
    if (activeModal === "completed") return summary.completed;
    if (activeModal === "reviewer") return summary.reviewer;
    if (activeModal === "performer") return summary.performer;
    return [];
  };

  const goToEditTask = (taskId) => {
    onSelectTask(taskId);
    navigate(`/task/${taskId}`);
  };

  return (
    <div className="dashboard-container">
      {(userRole === "admin" || userRole === "product") && (
        <div className="add-task-button-container">
          <button
            className="add-task-button"
            onClick={() => setShowAddTaskModal(true)}
          >
            ➕ Add New Task
          </button>
        </div>
      )}

      <div className="dashboard-cards-row">
        <div
          className="summary-card green"
          onClick={() => setActiveModal("completed")}
        >
          ✅ Completed Tasks: {summary.completed.length}
        </div>
        <div
          className="summary-card yellow"
          onClick={() => setActiveModal("reviewer")}
        >
          🟡 Product’s Actionable: {summary.reviewer.length}
        </div>
        <div
          className="summary-card blue"
          onClick={() => setActiveModal("performer")}
        >
          🔵 Compliance Actionable: {summary.performer.length}
        </div>
      </div>

      <div className="filter-panel">
        <input
          type="text"
          placeholder="Search by Task Name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Review">In Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Advertised">Advertised</option>
          <option value="Expired">Expired</option>
        </select>
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
        <button
          onClick={() => {
            setSearchText("");
            setStatusFilter("All");
            setDateFrom("");
            setDateTo("");
          }}
        >
          Reset
        </button>
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Task Name</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Latest Version</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <React.Fragment key={task.id}>
              <tr
                className="clickable-row"
                onClick={() => toggleExpand(task.id)}
              >
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.createdDate}</td>
                <td>
                  {task.subTasks.length > 0
                    ? task.subTasks[task.subTasks.length - 1].version
                    : "N/A"}
                </td>
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
                  <td colSpan="6">
                    <strong>Latest Comment:</strong>{" "}
                    {task.comments?.[task.comments.length - 1]?.text ||
                      "No comments"}
                    <br />
                    <strong>Files:</strong>{" "}
                    {task.files?.map((f) => f.name).join(", ") || "No files"}
                    <br />
                    <button onClick={() => goToEditTask(task.id)}>
                      Go to Task
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onCreateTask={addTask}
      />

      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-content wide">
            <h3>
              {activeModal === "completed" && "✅ Completed Tasks"}
              {activeModal === "reviewer" && "🟡 Product’s Actionable Tasks"}
              {activeModal === "performer" && "🔵 Compliance Actionable Tasks"}
            </h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Task Name</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Latest Version</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getModalTasks().map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.status}</td>
                    <td>{task.createdDate}</td>
                    <td>
                      {task.subTasks.length > 0
                        ? task.subTasks[task.subTasks.length - 1].version
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          goToEditTask(task.id);
                          closeModal();
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
