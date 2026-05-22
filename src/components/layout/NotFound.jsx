import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="section-container"
      style={{
        textAlign: "center",
        padding: "60px 20px",
        marginTop: "40px",
        maxWidth: "600px",
        margin: "40px auto",
      }}
    >
      <h1
        style={{
          fontSize: "5rem",
          color: "var(--danger)",
          marginBottom: "10px",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "var(--text-muted)",
          marginBottom: "30px",
        }}
      >
        Oops! The page you are looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
