import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Make sure you have this to grab the user
import { applyForJob } from "../../services/applicationService";
import { uploadResumeFile } from "../../services/resumeService";
import API from "../../api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // 1. Fetch the job details
    const fetchJobDetails = async () => {
      try {
        const res = await API.get(`/jobseeker/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
      }
    };

    // 2. NEW: Check if the logged-in user already applied for this specific job
    const checkApplicationStatus = async () => {
      if (user && user.role === "ROLE_JOBSEEKER") {
        try {
          const apps = await getUserApplications();
          // If any of their past applications match this page's job ID, flag it as true!
          const alreadyApplied = apps.some((app) => app.jobId === Number(id));
          setHasApplied(alreadyApplied);
        } catch (err) {
          console.error("Failed to check application status", err);
        }
      }
    };

    fetchJobDetails();
    checkApplicationStatus();
  }, [id, user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please choose a resume file to upload first.");

    try {
      setUploading(true);

      // Step 1: Upload the file to get the server filename string
      const uploadMessage = await uploadResumeFile(file);
      const extractedFileName = uploadMessage.split(": ")[1]; // Parses out the raw filename

      // Step 2: Use that filename string to submit the final application row
      await applyForJob(id, extractedFileName);

      alert("Application submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Application submission failed.");
    } finally {
      setUploading(false);
    }
  };

  if (!job)
    return <div className="dashboard-container">Loading job details...</div>;

  return (
    <div className="dashboard-container">
      <div
        className="section-container"
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <h2>{job.title}</h2>
        <p style={{ fontSize: "18px", color: "#555", margin: "5px 0 20px" }}>
          {job.company} — {job.location}
        </p>

        <div
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "15px",
            marginBottom: "15px",
          }}
        >
          <p>
            <strong>Job Type:</strong> {job.type || "Full-Time"}
          </p>
          <p>
            <strong>Salary:</strong> {job.salary || "Undisclosed"}
          </p>
        </div>

        <h3>Job Description</h3>
        <p style={{ lineHeight: "1.6", color: "#444" }}>{job.description}</p>

        <form
          onSubmit={handleApply}
          style={{
            marginTop: "30px",
            borderTop: "1px solid #eee",
            paddingTop: "20px",
          }}
        >
          <h3>Apply for this position</h3>
          <label
            style={{ display: "block", marginBottom: "10px", color: "#666" }}
          >
            Upload your Resume (PDF/Doc):
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "20px", display: "block" }}
            disabled={uploading}
          >
            {uploading ? "Processing Application..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobDetails;
