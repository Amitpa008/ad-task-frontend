import React, { useState } from "react";

const AddTaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adType, setAdType] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 5);
    setFiles(selectedFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      id: Date.now(),
      title,
      description,
      adType,
      productCategory,
      platform,
      publishDate,
      remarks,
      createdDate,
      files,
      subTasks: [],
      exchangeApprovals: {
        NSE: "Pending",
        BSE: "Pending",
        MCX: "Pending",
        NCDEX: "Pending",
      },
      status: "Open",
    };
    onAddTask(task);
    // Reset form
    setTitle("");
    setDescription("");
    setAdType("");
    setProductCategory("");
    setPlatform("");
    setPublishDate("");
    setRemarks("");
    setCreatedDate("");
    setFiles([]);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "6px",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #ddd",
      }}
    >
      <h2>Add New Ad Task</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label>Ad Name (Title):</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <label>Ad Type:</label>
        <select
          value={adType}
          onChange={(e) => setAdType(e.target.value)}
          required
        >
          <option value="">Select Ad Type</option>
          <option value="Digital">Digital</option>
          <option value="Print">Print</option>
          <option value="TV">TV</option>
          <option value="Outdoor">Outdoor</option>
        </select>

        <label>Product Category:</label>
        <input
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        />

        <label>Platform:</label>
        <input value={platform} onChange={(e) => setPlatform(e.target.value)} />

        <label>Expected Publish Date:</label>
        <input
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
        />

        <label>Remarks:</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={2}
        />

        <label>Created Date:</label>
        <input
          type="date"
          value={createdDate}
          onChange={(e) => setCreatedDate(e.target.value)}
          required
        />

        <label>Upload Files (max 5):</label>
        <input type="file" multiple onChange={handleFileChange} />

        {files.length > 0 && (
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          style={{
            marginTop: "12px",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;
