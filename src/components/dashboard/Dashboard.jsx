// src/components/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getJobsByRecruiter } from "../../services/jobService";
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
        Welcome back, <strong>{user.name}</strong>
      </p>

      {/* Pass the user object down so the child components know who is querying the database */}
      {isRecruiter ? (
        <RecruiterDashboard user={user} />
      ) : (
        <JobSeekerDashboard />
      )}
    </div>
  );
};

// ==========================================
// RECRUITER VIEW (Now with Real Data Fetching)
// ==========================================
const RecruiterDashboard = ({ user }) => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch jobs specific to this logged-in recruiter
    const fetchMyJobs = async () => {
      try {
        // Assuming your user object has an 'id' from the database
        const data = await getJobsByRecruiter(user.id);
        setMyJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [user.id]);

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
            {/* Map through the real data from Spring Boot */}
            {myJobs.map((job) => (
              <div key={job.id} className="list-item">
                <h3 style={{ color: "#333", marginBottom: "5px" }}>
                  {job.title}
                </h3>
                <p style={{ color: "#666" }}>
                  {job.location} • {job.type || "Full-Time"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// JOBSEEKER VIEW (Cleaned up with CSS)
// ==========================================
const JobSeekerDashboard = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getUserApplications(user.id);
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchApplications();
    }
  }, [user]);

  return (
    <>
      <div className="stats-grid">
        <div className="card">
          <h3>Applied Jobs</h3>
          {/* Dynamically count the applications array */}
          <h1>{loading ? "..." : applications.length}</h1>
        </div>
        <div className="card">
          <h3>Saved Jobs</h3>
          <h1>0</h1>{" "}
          {/* You can make this dynamic later when you build the Saved Jobs feature */}
        </div>
        <div className="card">
          <h3>Profile Completion</h3>
          <h1>80%</h1>{" "}
          {/* This can be calculated based on how many user fields are filled out later */}
        </div>
      </div>

      <div className="section-container">
        <h2>Recent Applications</h2>

        <div style={{ marginTop: "20px" }}>
          {loading ? (
            <p>Loading your applications...</p>
          ) : applications.length === 0 ? (
            <p>
              You haven't applied to any jobs yet. Head over to the Jobs page to
              get started!
            </p>
          ) : (
            <div>
              {/* Map through the real application data from Spring Boot */}
              {applications.map((app) => (
                <div key={app.id} className="list-item">
                  <h3 style={{ color: "#333", marginBottom: "5px" }}>
                    {app.job.title}{" "}
                    {/* Assumes your backend returns the joined Job object */}
                  </h3>
                  <p style={{ color: "#666", textTransform: "capitalize" }}>
                    {app.job.company} • Status: <strong>{app.status}</strong>
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
export default Dashboard;
