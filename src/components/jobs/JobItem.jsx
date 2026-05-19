import { Link } from "react-router-dom";

const JobItem = ({ job }) => {
  return (
    <div
      style={{
        padding: "18px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
      }}
    >
      <h2>{job.title}</h2>
      <p style={{ marginTop: "6px", color: "#555" }}>
        {job.company} - {job.location} - {job.type}
      </p>
      <p style={{ marginTop: "8px" }}>{job.experience}</p>
      <Link
        to={`/jobs/${job.id}`}
        style={{
          display: "inline-block",
          marginTop: "14px",
          color: "#222",
          fontWeight: "600",
        }}
      >
        View Details
      </Link>
    </div>
  );
};

export default JobItem;
