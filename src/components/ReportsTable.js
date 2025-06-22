import React from "react";

const ReportsTable = () => {
  const reports = [
    {
      id: 1,
      name: "Sales Summary Q1",
      date: "2024-04-15",
      status: "Completed",
    },
    {
      id: 2,
      name: "Inventory Report",
      date: "2024-04-10",
      status: "In Progress",
    },
    {
      id: 3,
      name: "Customer Feedback",
      date: "2024-04-12",
      status: "Pending",
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Reports</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Report Name
            </th>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Report Date
            </th>
            <th
              style={{
                borderBottom: "2px solid #ddd",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Report Status
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>{report.name}</td>
              <td style={{ padding: "10px" }}>{report.date}</td>
              <td style={{ padding: "10px" }}>{report.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
