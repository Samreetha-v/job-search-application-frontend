// src/components/jobs/PostJob.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createJob } from "../../services/jobService";

const PostJob = () => {
  const navigate = useNavigate();
  // Get the logged-in user from Redux so we can attach their ID to the job
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full-Time",
    description: "",
  });

  const { title, company, location, salary, type, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Combine the form data with the recruiter's ID
      const jobPayload = {
        ...formData,
        recruiterId: user.id, // CRITICAL: Links the job to this specific recruiter
      };

      // 2. Send it to Spring Boot
      await createJob(jobPayload);

      alert("Job posted successfully!");
      navigate("/dashboard"); // Redirect back to dashboard to see the new job
    } catch (err) {
      console.error("Error posting job:", err);
      alert("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Post a New Job</h2>
      </div>

      <div className="section-container" style={{ maxWidth: "600px" }}>
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            placeholder="Job Title (e.g. Senior Java Developer)"
            name="title"
            value={title}
            onChange={onChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Company Name"
            name="company"
            value={company}
            onChange={onChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Location (e.g. Chennai, Remote)"
            name="location"
            value={location}
            onChange={onChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Salary Range (e.g. ₹8,000,000 - ₹12,000,000)"
            name="salary"
            value={salary}
            onChange={onChange}
            style={inputStyle}
          />

          <select
            name="type"
            value={type}
            onChange={onChange}
            style={inputStyle}
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <textarea
            placeholder="Job Description & Requirements..."
            name="description"
            value={description}
            onChange={onChange}
            required
            rows="6"
            style={{ ...inputStyle, resize: "vertical" }}
          ></textarea>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "10px" }}
          >
            Publish Job
          </button>
        </form>
      </div>
    </div>
  );
};

// A quick reusable style object for the form inputs
const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
  fontFamily: "inherit",
};

export default PostJob;
