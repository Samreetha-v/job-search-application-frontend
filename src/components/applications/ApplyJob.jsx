import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById, getJobs } from "../../services/jobService";

const ApplyJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resumeLink: "",
    coverLetter: "",
  });

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = id ? await getJobById(id) : (await getJobs())[0];
        setJob(data);
      } catch (error) {
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const onChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading application form...</div>;
  }

  if (!job) {
    return <div style={{ padding: "30px" }}>Job not found.</div>;
  }

  return (
    <div style={{ padding: "30px", maxWidth: "760px", margin: "0 auto" }}>
      <h1>Apply for {job.title}</h1>
      <p style={{ marginTop: "8px", color: "#555" }}>
        {job.company} - {job.location} - {job.type}
      </p>

      {submitted ? (
        <div
          style={{
            marginTop: "24px",
            padding: "18px",
            background: "#e8f5e9",
            border: "1px solid #a5d6a7",
            borderRadius: "8px",
          }}
        >
          <h2>Application submitted</h2>
          <p style={{ marginTop: "8px" }}>
            Your mock application has been recorded for frontend testing.
          </p>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          style={{
            marginTop: "24px",
            display: "grid",
            gap: "16px",
          }}
        >
          <input
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={onChange}
            required
            style={inputStyle}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={onChange}
            required
            style={inputStyle}
          />
          <input
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={onChange}
            required
            style={inputStyle}
          />
          <input
            name="resumeLink"
            placeholder="Resume link"
            value={formData.resumeLink}
            onChange={onChange}
            style={inputStyle}
          />
          <textarea
            name="coverLetter"
            placeholder="Short cover letter"
            value={formData.coverLetter}
            onChange={onChange}
            rows="5"
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 18px",
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Submit Application
          </button>
        </form>
      )}
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "16px",
};

export default ApplyJob;
