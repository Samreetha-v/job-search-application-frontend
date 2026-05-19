// src/components/jobs/Jobs.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../../services/jobService"; // <-- FIX: Updated import name

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs(); // <-- FIX: Call the correct function
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Available Jobs</h2>
      </div>

      <div className="section-container">
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs available at the moment. Please check back later!</p>
        ) : (
          <div>
            {jobs.map((job) => (
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
                    {/* Assuming your backend returns these fields */}
                    {job.company} • {job.location} • {job.salary}
                  </p>
                </div>

                {/* Link to the Job Details page */}
                <Link to={`/jobs/${job.id}`} className="btn-primary">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
