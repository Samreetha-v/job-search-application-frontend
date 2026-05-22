import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllJobs,
  searchJobs,
  filterJobsByLocation,
  filterJobsBySkills,
  filterJobsByExperience,
} from "../../services/jobService";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [expFilter, setExpFilter] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load all jobs on initial mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle generic keyword search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return fetchJobs();

    setLoading(true);
    try {
      const data = await searchJobs(searchQuery);
      setJobs(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle specific backend filters
  const handleFilter = async (filterType) => {
    setLoading(true);
    try {
      let data = [];
      if (filterType === "location" && locationFilter.trim()) {
        data = await filterJobsByLocation(locationFilter);
        setSkillsFilter("");
        setExpFilter("");
        setSearchQuery("");
      } else if (filterType === "skills" && skillsFilter.trim()) {
        data = await filterJobsBySkills(skillsFilter);
        setLocationFilter("");
        setExpFilter("");
        setSearchQuery("");
      } else if (filterType === "experience" && expFilter.trim()) {
        data = await filterJobsByExperience(Number(expFilter));
        setLocationFilter("");
        setSkillsFilter("");
        setSearchQuery("");
      } else {
        data = await getAllJobs();
      }
      setJobs(data);
    } catch (err) {
      console.error("Filtering failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setSkillsFilter("");
    setExpFilter("");
    fetchJobs();
  };

  return (
    <div
      className="dashboard-container"
      style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}
    >
      {/* HEADER SECTION */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#333", marginBottom: "10px" }}>
          Discover Your Next Role
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          Browse thousands of job openings and find the perfect fit.
        </p>
      </div>

      {/* SEARCH & FILTER TOOLBAR */}
      <div
        className="section-container"
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        {/* Main Search Bar */}
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
        >
          <input
            type="text"
            placeholder="Search by job title, keyword, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: "0 24px" }}
          >
            Search
          </button>
        </form>

        {/* Granular Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          <div>
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                type="text"
                placeholder="Location (e.g., Chennai)"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={filterInputStyle}
              />
              <button
                onClick={() => handleFilter("location")}
                className="btn-primary"
                style={filterBtnStyle}
              >
                Go
              </button>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                type="text"
                placeholder="Skills (e.g., Java, Python)"
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
                style={filterInputStyle}
              />
              <button
                onClick={() => handleFilter("skills")}
                className="btn-primary"
                style={filterBtnStyle}
              >
                Go
              </button>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", gap: "5px" }}>
              <input
                type="number"
                placeholder="Max Experience (Years)"
                value={expFilter}
                onChange={(e) => setExpFilter(e.target.value)}
                style={filterInputStyle}
              />
              <button
                onClick={() => handleFilter("experience")}
                className="btn-primary"
                style={filterBtnStyle}
              >
                Go
              </button>
            </div>
          </div>
        </div>

        {(searchQuery || locationFilter || skillsFilter || expFilter) && (
          <button
            onClick={clearFilters}
            className="btn-primary"
            style={{ marginTop: "15px", background: "#6c757d", width: "100%" }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* JOB LISTINGS */}
      <div>
        <h2 style={{ marginBottom: "20px" }}>
          {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"} Found
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
            Fetching jobs...
          </p>
        ) : jobs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <h3>No jobs match your criteria</h3>
            <p style={{ color: "#666" }}>
              Try adjusting your filters or searching for different keywords.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {jobs.map((job) => (
              <div
                key={job.id}
                className="list-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px",
                  border: "1px solid #eaeaea",
                  borderRadius: "8px",
                  transition: "box-shadow 0.3s ease",
                }}
              >
                <div>
                  <h3
                    style={{
                      color: "#007bff",
                      margin: "0 0 8px 0",
                      fontSize: "1.3rem",
                    }}
                  >
                    {job.title}
                  </h3>
                  <div
                    style={{
                      color: "#555",
                      display: "flex",
                      gap: "15px",
                      flexWrap: "wrap",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span>
                      <strong>🏢</strong> {job.company}
                    </span>
                    <span>
                      <strong>📍</strong> {job.location}
                    </span>
                    <span>
                      <strong>💼</strong> {job.experience} Yrs
                    </span>
                    {job.salary && (
                      <span>
                        <strong>💰</strong> {job.salary}
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: "10px", color: "#666" }}>
                    <small>Skills: {job.skills || "Not specified"}</small>
                  </div>
                </div>

                <div style={{ marginLeft: "20px" }}>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="btn-primary"
                    style={{ padding: "10px 20px", whiteSpace: "nowrap" }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple reusable input styles
const filterInputStyle = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
};

const filterBtnStyle = {
  padding: "10px 15px",
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Jobs;
