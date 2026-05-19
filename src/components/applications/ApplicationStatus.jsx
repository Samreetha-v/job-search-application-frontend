import { useEffect, useState } from "react";
import { getApplications } from "../../services/applicationService";
import { getJobs } from "../../services/jobService";

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [jobsById, setJobsById] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const [applicationData, jobData] = await Promise.all([
          getApplications(),
          getJobs(),
        ]);

        const jobMap = jobData.reduce((map, job) => {
          map[job.id] = job;
          return map;
        }, {});

        setApplications(applicationData);
        setJobsById(jobMap);
      } catch (error) {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading applications...</div>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Application Status</h1>
      <p style={{ marginTop: "8px", color: "#555" }}>
        Track your submitted job applications.
      </p>

      <div style={{ marginTop: "24px", display: "grid", gap: "16px" }}>
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          applications.map((application) => {
            const job = jobsById[application.jobId];

            return (
              <div
                key={application.id}
                style={{
                  padding: "18px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                }}
              >
                <h2>{job?.title || "Job unavailable"}</h2>
                <p style={{ marginTop: "6px", color: "#555" }}>
                  {job
                    ? `${job.company} - ${job.location}`
                    : "Mock job data missing"}
                </p>
                <p style={{ marginTop: "12px" }}>
                  Status: <strong>{application.status}</strong>
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApplicationStatus;
