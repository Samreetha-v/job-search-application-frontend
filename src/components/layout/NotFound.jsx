import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>404</h1>
      <p style={{ marginTop: "8px" }}>Page not found.</p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: "16px",
          color: "#222",
          fontWeight: "600",
        }}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
