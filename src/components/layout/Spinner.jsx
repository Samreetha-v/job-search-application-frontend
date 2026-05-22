const Spinner = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "4px solid var(--border)",
          borderTop: "4px solid var(--primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      {/* Inline keyframes to keep the spinner self-contained */}
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
};

export default Spinner;
