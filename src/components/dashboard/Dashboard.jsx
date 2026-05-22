import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getJobsByRecruiter,
  getAllJobs,
  searchJobs,
  updateJobDetails,
  deleteJobListing,
  filterJobsByLocation, 
  filterJobsBySkills, 
  filterJobsByExperience, 
} from "../../services/jobService";
import { getUserApplications } from "../../services/applicationService";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);
  const user = auth.user;

  if (!user) {
    return <div className="dashboard-container">Loading dashboard...</div>;
  }

  const isRecruiter = user.role === "ROLE_RECRUITER";

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p className="dashboard-welcome">
        Welcome back, <strong>{user.name || user.email}</strong>
      </p>

      {/* FIX: Explicitly passing user prop to both dashboard variants */}
      {isRecruiter ? (
        <RecruiterDashboard user={user} />
      ) : (
        <JobSeekerDashboard user={user} />
      )}
    </div>
  );
};
// ==========================================
// RECRUITER VIEW (With Inline Edit & Delete)
// ==========================================
const RecruiterDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // States to track which job is being edited and its form data
  const [editingJobId, setEditingJobId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    type: "Full-Time",
  });

  const fetchMyJobs = async () => {
    try {
      const data = await getJobsByRecruiter();
      setMyJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchMyJobs();
    }
  }, [user]);

  // Triggered when clicking "Edit" to populate the inline form fields
  const startEditing = (job) => {
    setEditingJobId(job.id);
    setEditFormData({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      description: job.description || "",
      salary: job.salary || "",
      type: job.type || "Full-Time",
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Submits the updated job data to the PUT endpoint
  const handleUpdateSubmit = async (e, jobId) => {
    e.preventDefault();
    try {
      await updateJobDetails(jobId, editFormData);
      alert("Job updated successfully!");
      setEditingJobId(null); // Close the edit mode
      fetchMyJobs(); // Refresh the list
    } catch (err) {
      console.error("Failed to update job:", err);
      alert("Error updating job. Please try again.");
    }
  };

  // Submits the deletion request to the DELETE endpoint
  const handleDelete = async (jobId) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this job listing?",
      )
    ) {
      try {
        await deleteJobListing(jobId);
        alert("Job deleted successfully!");
        fetchMyJobs(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete job:", err);
        alert("Error deleting job.");
      }
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <div className="dashboard-header">
        <h2>My Posted Jobs</h2>
        <Link to="/post-job" className="btn-primary">
          + Post a New Job
        </Link>
      </div>

      <div className="section-container">
        {loading ? (
          <p>Loading your jobs...</p>
        ) : myJobs.length === 0 ? (
          <p>
            No jobs posted yet. Click the button above to create your first job
            listing!
          </p>
        ) : (
          <div>
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="list-item"
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "15px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {/* CONDITIONAL RENDERING: Show the edit form if this job's ID matches the active edit ID */}
                {editingJobId === job.id ? (
                  <form
                    onSubmit={(e) => handleUpdateSubmit(e, job.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditChange}
                      required
                    />
                    <input
                      type="text"
                      name="company"
                      value={editFormData.company}
                      onChange={handleEditChange}
                      required
                    />
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditChange}
                      required
                    />
                    <input
                      type="text"
                      name="salary"
                      value={editFormData.salary}
                      onChange={handleEditChange}
                      placeholder="Salary Range"
                    />
                    <select
                      name="type"
                      value={editFormData.type}
                      onChange={handleEditChange}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      required
                      rows="4"
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ background: "#28a745" }}
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ background: "#6c757d" }}
                        onClick={() => setEditingJobId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* REGULAR VIEW: Displays the job info and action control buttons */
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3 style={{ color: "#333", margin: "0 0 5px 0" }}>
                        {job.title}
                      </h3>
                      <p style={{ color: "#666", margin: 0 }}>
                        {job.company} • {job.location} •{" "}
                        {job.type || "Full-Time"} •{" "}
                        {job.salary || "Salary Undisclosed"}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        className="btn-primary"
                        style={{ background: "#007bff" }}
                      >
                        View Applicants
                      </Link>
                      <button
                        onClick={() => startEditing(job)}
                        className="btn-primary"
                        style={{ background: "#ffc107", color: "#000" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="btn-primary"
                        style={{ background: "#dc3545" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// JOBSEEKER VIEW (With Advanced Database Filtering)
// ==========================================
const JobSeekerDashboard = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Advanced Filter States
  const [locationFilter, setLocationFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [expFilter, setExpFilter] = useState("");

  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Initial Data Fetching
  const fetchInitialData = async () => {
    setLoadingJobs(true);
    try {
      const appData = await getUserApplications();
      setApplications(appData);

      const jobsData = await getAllJobs();
      setAvailableJobs(jobsData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoadingApps(false);
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchInitialData();
    }
  }, [user]);

  // Handle Backend Filter Requests
  const handleBackendFilter = async (filterType) => {
    setLoadingJobs(true);
    try {
      let data = [];
      if (filterType === "location" && locationFilter.trim()) {
        data = await filterJobsByLocation(locationFilter);
        setSkillsFilter("");
        setExpFilter("");
      } else if (filterType === "skills" && skillsFilter.trim()) {
        data = await filterJobsBySkills(skillsFilter);
        setLocationFilter("");
        setExpFilter("");
      } else if (filterType === "experience" && expFilter.trim()) {
        data = await filterJobsByExperience(Number(expFilter));
        setLocationFilter("");
        setSkillsFilter("");
      } else {
        data = await getAllJobs(); // Reset
      }
      setAvailableJobs(data);
    } catch (err) {
      console.error("Filtering failed:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleResetFilters = () => {
    setLocationFilter("");
    setSkillsFilter("");
    setExpFilter("");
    setSearchQuery("");
    fetchInitialData();
  };

  // Standard Frontend Search bar fallback
  const filteredJobs = availableJobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      (job.title && job.title.toLowerCase().includes(query)) ||
      (job.company && job.company.toLowerCase().includes(query)) ||
      (job.location && job.location.toLowerCase().includes(query))
    );
  });

  return (
    <>
      {/* Metrics Board - Cleaned up to only show real DB data */}
      <div className="stats-grid" style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div className="card" style={{ flex: 1, padding: "20px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #ddd" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Total Applications Submitted</h3>
          <h1 style={{ margin: 0, color: "#007bff", fontSize: "2.5rem" }}>
            {loadingApps ? "..." : applications.length}
          </h1>
        </div>
      </div>

      {/* Advanced Filter Toolbox */}
      <div className="section-container" style={{ marginTop: "40px" }}>
        <h2>Advanced Job Filters</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "15px",
          }}
        >
          {/* Location Filter Input */}
          <div>
            <label style={{ fontSize: "14px", color: "#555" }}>
              Filter by Location
            </label>
            <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
              <input
                type="text"
                placeholder="e.g. Chennai"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={filterInputStyle}
              />
              <button
                onClick={() => handleBackendFilter("location")}
                className="btn-primary"
                style={filterBtnStyle}
              >
                Go
              </button>
            </div>
          </div>

          {/* Skills Filter Input */}
          <div>
            <label style={{ fontSize: "14px", color: "#555" }}>
              Filter by Skills
            </label>
            <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
              <input
                type="text"
                placeholder="e.g. Java"
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
                style={filterInputStyle}
              />
              <button
                onClick={() => handleBackendFilter("skills")}
                className="btn-primary"
                style={filterBtnStyle}
              >
                Go
              </button>
            </div>
          </div>

          {/* Experience Filter Input */}
          <div>
            <label style={{ fontSize: "14px", color: "#555" }}>
              Max Experience (Years)
            </label>
            <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
              <input
                type="number"
                placeholder="e.g. 3"
                value={expFilter}
                onChange={(e) => setExpFilter(e.target.value)}
                style={filterInputStyle}
              />
              <button
                onClick={() => handleBackendFilter("experience")}
                className="btn-primary"
                style={filterBtnStyle}
              >
                Go
              </button>
            </div>
          </div>
        </div>

        {(locationFilter || skillsFilter || expFilter || searchQuery) && (
          <button
            onClick={handleResetFilters}
            className="btn-primary"
            style={{ marginTop: "15px", background: "#6c757d" }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Job Feed List */}
      <div className="section-container" style={{ marginTop: "30px" }}>
        <h2>Explore Matching Jobs</h2>
        <input
          type="text"
          placeholder="Keyword search across current results..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <div style={{ maxHeight: "350px", overflowY: "auto" }}>
          {loadingJobs ? (
            <p>Processing query filter records...</p>
          ) : filteredJobs.length === 0 ? (
            <p>No jobs found matching your criteria.</p>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="list-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3 style={{ color: "#333", marginBottom: "5px" }}>
                    {job.title}
                  </h3>
                  <p style={{ color: "#666" }}>
                    {job.company} • {job.location} •{" "}
                    {job.salary || "Salary Undisclosed"}
                  </p>
                </div>
                <Link
                  to={`/jobs/${job.id}`}
                  className="btn-primary"
                  style={{ fontSize: "14px" }}
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Track Applications */}
      <div className="section-container" style={{ marginTop: "40px" }}>
        <h2>Recent Applications</h2>
        <div style={{ marginTop: "20px" }}>
          {loadingApps ? (
            <p>Loading your applications...</p>
          ) : applications.length === 0 ? (
            <p>You haven't applied to any positions yet.</p>
          ) : (
            <div>
              {applications.map((app) => (
                <div key={app.id} className="list-item">
                  <h3 style={{ color: "#333", marginBottom: "5px" }}>
                    {app.job?.title || `Job ID: ${app.jobId}`}
                  </h3>
                  <p style={{ color: "#666", textTransform: "capitalize" }}>
                    {app.job?.company || "Company Listing"} • Status:{" "}
                    <strong>{app.status || "APPLIED"}</strong>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Simple reusable input styles
const filterInputStyle = {
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
};

const filterBtnStyle = {
  padding: "8px 12px",
  fontSize: "14px",
};

export default Dashboard;
