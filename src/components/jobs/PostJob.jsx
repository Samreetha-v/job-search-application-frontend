// src/components/jobs/PostJob.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../services/jobService";

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "", // Will parse to Double before sending
    skills: "", // Matches String skills in Java
    experience: "", // Matches Integer experience in Java
    description: "",
  });

  const { title, company, location, salary, skills, experience, description } =
    formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the data payload to perfectly match your Job.java types
      const jobPayload = {
        title,
        company,
        location,
        description,
        skills, // Sent as a plain text string (e.g. "Java, Spring Boot")
        experience: parseInt(experience, 10), // Converts React string to Java Integer
        salary: parseFloat(salary), // Converts React string to Java Double
      };

      // Send to Spring Boot (RecruiterController handles the Principal recruiterId mapping!)
      await createJob(jobPayload);

      alert("Job posted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error posting job:", err);
      alert(
        "Failed to post job. Check browser console for parsing mismatch details.",
      );
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
            type="number"
            step="0.01"
            placeholder="Salary (e.g. 850000.00)"
            name="salary"
            value={salary}
            onChange={onChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Required Skills (e.g. Java, SQL, React)"
            name="skills"
            value={skills}
            onChange={onChange}
            required
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Maximum Experience Required (Years)"
            name="experience"
            value={experience}
            onChange={onChange}
            required
            style={inputStyle}
          />

          <textarea
            placeholder="Job Description & Requirements..."
            name="description"
            value={description}
            maxLength={1000}
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

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px",
  fontFamily: "inherit",
};

export default PostJob;
