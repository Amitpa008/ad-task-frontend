import React, { useState } from "react";
import "./EditTaskPage.css";

const EditTaskPage = ({
  task,
  onAddSubTask,
  onStatusChange,
  onExchangeStatusChange,
  onAddComment,
  onAddSubTaskComment,
  userRole = "Product",
}) => {
  if (!task) return <p className="edit-task-page">No task selected.</p>;

  const [remarks, setRemarks] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [subTaskCommentMap, setSubTaskCommentMap] = useState({});
  const [globalComment, setGlobalComment] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [expandedVersions, setExpandedVersions] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [tempStatus, setTempStatus] = useState(task.status);
  const [statusMessage, setStatusMessage] = useState("");

  const latestVersion = task.subTasks[task.subTasks.length - 1];

  const handleFileUpload = (e) => {
    setUploadedFiles(Array.from(e.target.files));
  };

  const handleUploadVersion = (e) => {
    e.preventDefault();
    if (uploadedFiles.length === 0 && !remarks.trim()) return;

    const version = `Version ${task.subTasks.length + 1}.0`;
    const title = version;
    const fileData = uploadedFiles.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));

    const newSubTask = {
      id: Date.now(),
      title,
      version,
      files: fileData,
      remarks,
      uploadedBy: "Product Team",
      uploadedOn: new Date().toLocaleString(),
      comments: [],
    };

    onAddSubTask(task.id, newSubTask);
    setRemarks("");
    setUploadedFiles([]);
  };

  const handleStatusSubmit = () => {
    onStatusChange(task.id, tempStatus);
    setStatusMessage("✅ Status updated successfully!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleSubTaskCommentSubmit = (e, subTaskId) => {
    e.preventDefault();
    const text = subTaskCommentMap[subTaskId];
    if (!text || !text.trim()) return;
    onAddSubTaskComment(task.id, subTaskId, text);
    setSubTaskCommentMap((prev) => ({ ...prev, [subTaskId]: "" }));
  };

  const handleGlobalCommentSubmit = (e) => {
    e.preventDefault();
    if (!globalComment || !globalComment.trim()) return;

    const fullText = replyTo
      ? `@${replyTo.author}: ${replyTo.text}\n${globalComment}`
      : globalComment;

    onAddComment(task.id, fullText);
    setGlobalComment("");
    setReplyTo(null);
  };

  const toggleVersionExpand = (id) => {
    setExpandedVersions((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const renderFileLinks = (files) => (
    <ul>
      <strong>Files:</strong>
      {files.map((f, i) => (
        <li key={i}>
          {f.name}{" "}
          {f.url && (
            <a
              href={f.url}
              download={f.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔽
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  const renderSubTaskBlock = (subTask, isLatest = false) => (
    <div
      key={subTask.id}
      className={`version-block ${isLatest ? "latest" : ""}`}
    >
      <h4>{subTask.title}</h4>
      <p>
        <strong>Uploaded By:</strong> {subTask.uploadedBy || "Unknown"}
      </p>
      <p>
        <strong>Uploaded On:</strong> {subTask.uploadedOn || "Not Available"}
      </p>
      <p>
        <strong>Remarks:</strong>
      </p>
      <div
        style={{ background: "#f1f1f1", padding: "10px", borderRadius: "4px" }}
      >
        {subTask.remarks || "None"}
      </div>

      {subTask.files?.length > 0 && renderFileLinks(subTask.files)}

      <form onSubmit={(e) => handleSubTaskCommentSubmit(e, subTask.id)}>
        <textarea
          value={subTaskCommentMap[subTask.id] || ""}
          onChange={(e) =>
            setSubTaskCommentMap({
              ...subTaskCommentMap,
              [subTask.id]: e.target.value,
            })
          }
          placeholder="Add a comment..."
        />
        <button type="submit" style={{ marginTop: "8px" }}>
          Add Comment
        </button>
      </form>

      {subTask.comments?.length > 0 && (
        <ul className="subtask-comments">
          {subTask.comments.map((c) => (
            <li key={c.id}>
              <div>{c.text}</div>
              <em>
                — {c.author}, {c.timestamp}
              </em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderGlobalCommentsThread = () =>
    task.subTasks.map((subTask) => (
      <div key={subTask.id}>
        <div className="chat-version-divider">─── {subTask.version} ───</div>

        {subTask.remarks && (
          <div className="chat-msg">
            <div>
              <strong>📌 Remarks:</strong> {subTask.remarks}
            </div>
            <div className="chat-meta">
              — {subTask.uploadedBy || "Uploader"}, {subTask.uploadedOn}
            </div>
          </div>
        )}

        {subTask.comments?.map((c, idx) => (
          <div key={idx} className="chat-msg">
            <div>{c.text}</div>
            <div className="chat-meta">
              — <strong>{c.author}</strong>, <em>{c.timestamp}</em>
              {userRole !== "Admin" && (
                <button
                  onClick={() => setReplyTo(c)}
                  style={{ marginLeft: "8px" }}
                >
                  ↩ Reply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    ));

  const canComment = userRole === "Product" || userRole === "Compliance";

  return (
    <div className="edit-task-page">
      <div className="task-header">
        <h2>{task.title}</h2>
        <p>
          <strong>UIN:</strong> {task.id}
        </p>
        <div>
          <strong>Status:</strong>{" "}
          <select
            value={tempStatus}
            onChange={(e) => setTempStatus(e.target.value)}
          >
            {[
              "Open",
              "In Review",
              "Approved",
              "Rejected",
              "Advertised",
              "Expired",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button style={{ marginLeft: "10px" }} onClick={handleStatusSubmit}>
            Submit
          </button>
          {statusMessage && <div className="status-msg">{statusMessage}</div>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          💬 Comments
        </button>
      </div>

      <div className="section latest-version">
        <h3>🆕 Latest Version</h3>
        {renderSubTaskBlock(latestVersion, true)}
        <form onSubmit={handleUploadVersion}>
          <h4>Upload New Version</h4>
          <input type="file" multiple onChange={handleFileUpload} />
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks..."
          />
          <button type="submit" style={{ marginTop: "10px" }}>
            Upload & Create
          </button>
        </form>
      </div>

      <div className="section exchange-tracker">
        <h3>🏛️ Exchange Approval Table</h3>
        <table>
          <thead>
            <tr>
              <th>Exchange</th>
              <th>Status</th>
              <th>Approval Date</th>
              <th>Updated By</th>
              <th>Expiry Date</th>
              <th>Email Upload</th>
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {["NSE", "BSE", "MCX", "NCDEX"].map((exchange) => (
              <tr key={exchange}>
                <td>{exchange}</td>
                <td>
                  <select
                    value={task.exchangeApprovals?.[exchange] || "Not Sent"}
                    onChange={(e) =>
                      onExchangeStatusChange(task.id, exchange, e.target.value)
                    }
                  >
                    {["Not Sent", "Pending", "Approved", "Rejected"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td>
                  <input type="date" />
                </td>
                <td>Compliance</td>
                <td>
                  <input type="date" />
                </td>
                <td>
                  <input type="file" />
                </td>
                <td>
                  <button>Submit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section old-versions">
        <h3>🗂️ Previous Versions</h3>
        {task.subTasks
          .slice(0, -1)
          .reverse()
          .map((subTask) => (
            <div key={subTask.id} className="collapsed-version">
              <div
                className="collapsed-header"
                onClick={() => toggleVersionExpand(subTask.id)}
              >
                ▶ {subTask.version}
              </div>
              {expandedVersions.includes(subTask.id) && (
                <div className="collapsed-body">
                  {renderSubTaskBlock(subTask)}
                </div>
              )}
            </div>
          ))}
      </div>

      {showSidebar && (
        <div className="comment-sidebar">
          <h3>💬 Global Comments</h3>

          {canComment && (
            <form onSubmit={handleGlobalCommentSubmit}>
              <textarea
                value={globalComment}
                onChange={(e) => setGlobalComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <button type="submit" style={{ marginTop: "10px" }}>
                Post Comment
              </button>
            </form>
          )}

          <div className="chat-history">{renderGlobalCommentsThread()}</div>

          <button
            className="close-sidebar"
            onClick={() => setShowSidebar(false)}
          >
            ✖ Close
          </button>
        </div>
      )}
    </div>
  );
};

export default EditTaskPage;
