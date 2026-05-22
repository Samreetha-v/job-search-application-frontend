import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getJobApplicants,
  updateApplicationStatus,
} from "../../services/applicationService";
import API from "../../api";


const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const data = await getJobApplicants(jobId);
        setApplicants(data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      // Hits your @PutMapping("/applications/{appId}/status") endpoint
      await updateApplicationStatus(appId, newStatus);

      // Update local state so the UI updates instantly
      setApplicants((prevApps) =>
        prevApps.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app,
        ),
      );
      alert(`Application status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating status. Ensure it matches your backend Enum.");
    }
  };

  const handleDownloadResume = async (fileName) => {
    try {
      // 1. Securely fetch the physical file using your JWT-equipped Axios instance
      const response = await API.get(`/recruiter/download/resume/${fileName}`, {
        responseType: "blob", // CRITICAL: Tells Axios we are downloading a file, not JSON
      });

      // 2. Create a temporary local memory link for the downloaded file
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const downloadUrl = window.URL.createObjectURL(blob);

      // 3. Trigger the browser's native Save dialog
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName); // Forces the download action
      document.body.appendChild(link);
      link.click();

      // 4. Clean up the memory link
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Failed to download resume:", err);
      alert("Error downloading the resume. You may not have authorization.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Applications Received</h2>
      </div>

      <div className="section-container">
        {loading ? (
          <p>Loading applicants...</p>
        ) : applicants.length === 0 ? (
          <p>No candidates have applied for this position yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr
                  style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}
                >
                  <th style={tableHeaderStyle}>Candidate Name</th>
                  <th style={tableHeaderStyle}>Applied Date</th>
                  <th style={tableHeaderStyle}>Resume</th>
                  <th style={tableHeaderStyle}>Current Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id} style={{ borderBottom: "1px solid #eee" }}>
                    {/* Adjust if your Application entity joins the User object differently */}
                    <td style={tableDataStyle}>
                      <strong>{app.candidate?.name || "Unknown"}</strong>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {app.candidate?.email || ""}
                      </div>
                    </td>

                    <td style={tableDataStyle}>
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={tableDataStyle}>
                      <button
                        onClick={() => handleDownloadResume(app.resumeLink)}
                        className="btn-primary"
                        style={{
                          padding: "5px 10px",
                          fontSize: "14px",
                          background: "#007bff",
                        }}
                      >
                        📄 Download Resume
                      </button>
                    </td>
                    <td style={tableDataStyle}>
                      <span style={getStatusBadgeStyle(app.status)}>
                        {app.status}
                      </span>
                    </td>
                    <td style={tableDataStyle}>
                      <select
                        value={app.status || "APPLIED"}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value)
                        }
                        style={{ padding: "5px", borderRadius: "4px" }}
                      >
                        <option value="APPLIED" disabled>
                          Applied (New)
                        </option>{" "}
                        {/* Disabled so recruiters can't revert back to it */}
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple helper styles
const tableHeaderStyle = { padding: "12px", color: "#555", fontWeight: "bold" };
const tableDataStyle = { padding: "12px", color: "#333" };

const getStatusBadgeStyle = (status) => {
  let bg = "#e1f5fe",
    text = "#0288d1"; // Default Applied Blue
  if (status === "SHORTLISTED") {
    bg = "#e8f5e9";
    text = "#2e7d32";
  }
  if (status === "REJECTED") {
    bg = "#ffebee";
    text = "#c62828";
  }
  if (status === "UNDER_REVIEW") {
    bg = "#fff3e0";
    text = "#ef6c00";
  }

  return {
    padding: "4px 8px",
    borderRadius: "4px",
    backgroundColor: bg,
    color: text,
    fontWeight: "bold",
    fontSize: "12px",
    textTransform: "uppercase",
  };
};

export default JobApplicants;
