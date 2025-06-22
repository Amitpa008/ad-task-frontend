import React, { useState } from "react";
import "./AddTaskModal.css";

const AddTaskModal = ({ isOpen, onClose, onCreateTask }) => {
  const [adName, setAdName] = useState("");
  const [description, setDescription] = useState("");
  const [adType, setAdType] = useState("");
  const [files, setFiles] = useState([]);
  const [productCategory, setProductCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title: adName,
      description,
      adType,
      files: Array.from(files).map((file) => ({ name: file.name })),
      productCategory,
      platform,
      publishDate,
      remarks,
      createdDate: new Date().toISOString().split("T")[0],
      status: "Open",
      subTasks: [
        {
          id: 1,
          title: "Version 1.0",
          version: "1.0",
          files: Array.from(files).map((file) => ({ name: file.name })),
          remarks,
          comments: [],
        },
      ],
      exchangeApprovals: {
        NSE: "Pending",
        BSE: "Pending",
      },
      comments: [],
    };

    onCreateTask(newTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Ad Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ad Name"
            value={adName}
            onChange={(e) => setAdName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ad Type"
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
          />
          <input type="file" multiple onChange={handleFileChange} />
          <input
            type="text"
            placeholder="Product Category"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
          <input
            type="date"
            placeholder="Expected Publish Date"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
          />
          <textarea
            placeholder="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
