import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div
      style={{
        height: "calc(100vh - 150px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3.5rem",
          color: "var(--primary)",
          marginBottom: "15px",
        }}
      >
        Find Your Dream Job
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          color: "var(--text-muted)",
          marginBottom: "30px",
          maxWidth: "600px",
        }}
      >
        Connect with top employers and apply for the best opportunities easily
        through our secure portal.
      </p>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link
          to="/jobs"
          className="btn-primary"
          style={{ fontSize: "1.1rem", padding: "12px 25px" }}
        >
          Explore Jobs
        </Link>
        <Link
          to="/register"
          className="btn-secondary"
          style={{ fontSize: "1.1rem", padding: "12px 25px" }}
        >
          Sign Up Now
        </Link>
      </div>
    </div>
  );
};

export default Landing;
