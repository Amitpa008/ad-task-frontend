import React, { useState } from "react";

const TaskDetail = ({
  task,
  onAddSubTask,
  onStatusChange,
  onExchangeStatusChange,
  onAddComment,
  onAddSubTaskComment,
}) => {
  const [newComment, setNewComment] = useState("");
  const [remarks, setRemarks] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [subTaskCommentMap, setSubTaskCommentMap] = useState({});

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(task.id, newComment);
      setNewComment("");
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const handleSubTaskSubmit = (e) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) return;

    const version = `Version ${task.subTasks.length + 1}`;
    const title = version;

    const fileData = uploadedFiles.map((file) => ({ name: file.name }));

    const newSubTask = {
      id: Date.now(),
      title,
      version,
      files: fileData,
      remarks,
      comments: [],
    };

    onAddSubTask(task.id, newSubTask);
    setUploadedFiles([]);
    setRemarks("");
  };

  const handleSubTaskCommentSubmit = (e, subTaskId) => {
    e.preventDefault();
    const text = subTaskCommentMap[subTaskId]?.trim();
    if (!text) return;
    onAddSubTaskComment(task.id, subTaskId, text);
    setSubTaskCommentMap((prev) => ({ ...prev, [subTaskId]: "" }));
  };

  const statusOptions = [
    "Open",
    "Approved",
    "Rejected",
    "Approved but Pending",
    "Closed",
  ];

  const exchangeStatusOptions = ["Pending", "Approved", "Rejected"];

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "6px",
        border: "1px solid #ddd",
      }}
    >
      <h2>{task.title}</h2>

      <p>
        <strong>Description:</strong> {task.description || "Not provided"}
      </p>
      <p>
        <strong>Ad Type:</strong> {task.adType || "Not specified"}
      </p>
      <p>
        <strong>Product Category:</strong>{" "}
        {task.productCategory || "Not specified"}
      </p>
      <p>
        <strong>Platform:</strong> {task.platform || "Not specified"}
      </p>
      <p>
        <strong>Expected Publish Date:</strong>{" "}
        {task.publishDate || "Not specified"}
      </p>
      <p>
        <strong>Created Date:</strong> {task.createdDate}
      </p>
      <p>
        <strong>Remarks:</strong> {task.remarks || "None"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          style={{ padding: "6px", marginLeft: "8px" }}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </p>

      <h3>Exchange Approvals</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Exchange
            </th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {task.exchangeApprovals &&
            Object.entries(task.exchangeApprovals).map(([exchange, status]) => (
              <tr key={exchange}>
                <td>{exchange}</td>
                <td>
                  <select
                    value={status}
                    onChange={(e) =>
                      onExchangeStatusChange(task.id, exchange, e.target.value)
                    }
                    style={{ padding: "6px" }}
                  >
                    {exchangeStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "20px" }}>Sub-Tasks / Versions</h3>
      {task.subTasks.length === 0 ? (
        <p>No sub-tasks added yet.</p>
      ) : (
        <ul>
          {task.subTasks.map((subTask) => (
            <li key={subTask.id} style={{ marginBottom: "20px" }}>
              <strong>{subTask.title}</strong>
              {subTask.remarks && (
                <div>
                  <em>Remarks:</em> {subTask.remarks}
                </div>
              )}
              {subTask.files?.length > 0 && (
                <div>
                  <em>Files:</em>
                  <ul>
                    {subTask.files.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <form onSubmit={(e) => handleSubTaskCommentSubmit(e, subTask.id)}>
                <textarea
                  rows={2}
                  placeholder="Add comment to this version..."
                  value={subTaskCommentMap[subTask.id] || ""}
                  onChange={(e) =>
                    setSubTaskCommentMap({
                      ...subTaskCommentMap,
                      [subTask.id]: e.target.value,
                    })
                  }
                  style={{ width: "100%", padding: "8px", marginTop: "10px" }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    marginTop: "5px",
                  }}
                >
                  Add Comment
                </button>
              </form>
              {subTask.comments?.length > 0 && (
                <ul style={{ marginTop: "10px" }}>
                  {subTask.comments.map((c) => (
                    <li key={c.id}>
                      <strong>{c.author}</strong> ({c.timestamp}): {c.text}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubTaskSubmit}
        style={{ marginTop: "20px", display: "flex", flexDirection: "column" }}
      >
        <strong>Add SubTask (Auto Version):</strong>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          style={{ marginBottom: "8px", padding: "6px" }}
        />
        <textarea
          placeholder="Remarks..."
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          style={{ marginBottom: "8px", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Upload & Create Version
        </button>
      </form>

      <h3 style={{ marginTop: "30px" }}>Comments</h3>
      <form onSubmit={handleCommentSubmit} style={{ marginBottom: "10px" }}>
        <textarea
          rows={3}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "8px",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Comment
        </button>
      </form>

      {task.comments && task.comments.length > 0 ? (
        <ul>
          {task.comments.map((comment) => (
            <li key={comment.id} style={{ marginBottom: "8px" }}>
              <strong>{comment.author}</strong> ({comment.timestamp}):
              <br />
              {comment.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default TaskDetail;
