import "./styles.css";
import "./App.css";
import "./footer.css";

import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./Layout";
import DashboardPage from "./Pages/DashboardPage";
import AllTasksPage from "./Pages/AllTasksPage";
import EditTaskPage from "./Pages/EditTaskPage";

// ✅ Removed: AddTaskForm, ReportsTable, TaskDetail
import TaskList from "./components/TaskList";
import DashboardSummary from "./components/DashboardSummary";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const userRole = "admin"; // You can later get this from localStorage

  const addTask = (task) => {
    setTasks([...tasks, task]);
    setSelectedTaskId(task.id);
  };

  const handleSelectTask = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const onAddSubTask = (taskId, newSubTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            subTasks: [...task.subTasks, { ...newSubTask, comments: [] }],
          }
        : task
    );
    setTasks(updatedTasks);
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const handleExchangeStatusChange = (taskId, exchange, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            exchangeApprovals: {
              ...task.exchangeApprovals,
              [exchange]: newStatus,
            },
          }
        : task
    );
    setTasks(updatedTasks);
  };

  const handleAddComment = (taskId, commentText) => {
    const newComment = {
      id: Date.now(),
      author: "User",
      text: commentText,
      timestamp: new Date().toLocaleString(),
    };
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            comments: task.comments
              ? [...task.comments, newComment]
              : [newComment],
          }
        : task
    );
    setTasks(updatedTasks);
  };

  const handleAddSubTaskComment = (taskId, subTaskId, commentText) => {
    const newComment = {
      id: Date.now(),
      author: "User",
      text: commentText,
      timestamp: new Date().toLocaleString(),
    };
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedSubTasks = task.subTasks.map((subTask) =>
          subTask.id === subTaskId
            ? {
                ...subTask,
                comments: subTask.comments
                  ? [...subTask.comments, newComment]
                  : [newComment],
              }
            : subTask
        );
        return { ...task, subTasks: updatedSubTasks };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const filteredTasks =
    filterStatus === "All"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  return (
    <Router>
      <Layout userRole={userRole}>
        <Routes>
          {/* ✅ Set default route to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route
            path="/dashboard"
            element={
              <DashboardPage
                tasks={tasks}
                addTask={addTask}
                onSelectTask={handleSelectTask}
                selectedTask={selectedTask}
                onAddSubTask={onAddSubTask}
                onStatusChange={handleStatusChange}
                onExchangeStatusChange={handleExchangeStatusChange}
                onAddComment={handleAddComment}
                onAddSubTaskComment={handleAddSubTaskComment}
                userRole={userRole}
              />
            }
          />

          <Route
            path="/all-tasks"
            element={
              <AllTasksPage
                tasks={tasks}
                onSelectTask={handleSelectTask}
                userRole={userRole}
              />
            }
          />

          <Route
            path="/task/:id"
            element={
              selectedTask ? (
                <EditTaskPage
                  task={selectedTask}
                  onAddSubTask={onAddSubTask}
                  onStatusChange={handleStatusChange}
                  onExchangeStatusChange={handleExchangeStatusChange}
                  onAddComment={handleAddComment}
                  onAddSubTaskComment={handleAddSubTaskComment}
                  userRole={userRole}
                />
              ) : (
                <p style={{ padding: "20px" }}>No task selected.</p>
              )
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
