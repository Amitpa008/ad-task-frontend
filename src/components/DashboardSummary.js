import React from "react";

const statusStyles = {
  Open: "#007bff",
  Approved: "#28a745",
  Rejected: "#dc3545",
  "Approved but Pending": "#ffc107",
  Closed: "#6c757d",
};

const DashboardSummary = ({ tasks }) => {
  const statusCounts = tasks.reduce((counts, task) => {
    const status = task.status || "Open";
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  const allStatuses = [
    "Open",
    "Approved",
    "Rejected",
    "Approved but Pending",
    "Closed",
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        margin: "20px auto",
        maxWidth: "1000px",
      }}
    >
      {allStatuses.map((status) => (
        <div
          key={status}
          style={{
            flex: "1 1 180px",
            backgroundColor: statusStyles[status] || "#ccc",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h4 style={{ margin: "0 0 8px" }}>{status} Tasks</h4>
          <div style={{ fontSize: "1.8em", fontWeight: "bold" }}>
            {statusCounts[status] || 0}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
