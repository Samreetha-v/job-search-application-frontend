const Alert = ({ message, type = "info" }) => {
  if (!message) {
    return null;
  }

  // Maps your component prop to the global CSS classes
  const alertClass =
    type === "error" ? "alert alert-danger" : "alert alert-success";

  return <div className={alertClass}>{message}</div>;
};

export default Alert;
