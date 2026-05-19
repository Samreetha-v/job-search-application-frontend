const JobFilter = ({ searchTerm, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Search jobs"
      value={searchTerm}
      onChange={(event) => onSearchChange(event.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "16px",
      }}
    />
  );
};

export default JobFilter;
