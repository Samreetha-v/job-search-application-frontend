const Alert = ({ message, type = "info" }) => {
  if (!message) {
    return null;
  }

  const background = type === "error" ? "#ffebee" : "#e3f2fd";
  const border = type === "error" ? "#ef9a9a" : "#90caf9";

  return (
    <div
      style={{
        padding: "12px 16px",
        background,
        border: `1px solid ${border}`,
        borderRadius: "6px",
        marginBottom: "16px",
      }}
    >
      {message}
    </div>
  );
};

export default Alert;
