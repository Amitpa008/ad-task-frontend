import React from "react";

const TaskList = ({ tasks, onSelectTask }) => {
  return (
    <div>
      <h2>Task List</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 5px 0" }}>{task.title}</h3>
              <p style={{ margin: 0, fontSize: "0.9em", color: "#555" }}>
                Created on: {task.createdDate}
              </p>
            </div>
            <button
              onClick={() => onSelectTask(task.id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
