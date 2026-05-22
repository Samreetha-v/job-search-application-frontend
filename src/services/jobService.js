import API from "../api";

// ========================================================
// CANDIDATE / PUBLIC JOB ENDPOINTS (JobSeekerController)
// ========================================================

// Fetch all available jobs for candidates
export const getAllJobs = async () => {
  const res = await API.get("/jobseeker/jobs");
  return res.data;
};

// Fetch a single job's details by its ID
export const getJobById = async (jobId) => {
  // We use the /jobseeker path so both guests and candidates can view it
  const res = await API.get(`/jobseeker/jobs/${jobId}`);
  return res.data;
};

// Search jobs with keywords
export const searchJobs = async (keyword) => {
  const res = await API.get(`/jobseeker/jobs/search?keyword=${keyword}`);
  return res.data;
};

// Filter By Location
export const filterJobsByLocation = async (location) => {
  const res = await API.get(
    `/jobseeker/jobs/filter/location?location=${encodeURIComponent(location)}`,
  );
  return res.data;
};

// Filter By Skills
export const filterJobsBySkills = async (skills) => {
  const res = await API.get(
    `/jobseeker/jobs/filter/skills?skills=${encodeURIComponent(skills)}`,
  );
  return res.data;
};

// Filter By Experience
export const filterJobsByExperience = async (experience) => {
  const res = await API.get(
    `/jobseeker/jobs/filter/experience?experience=${experience}`,
  );
  return res.data;
};

// ========================================================
// RECRUITER ONLY JOB ENDPOINTS (RecruiterController)
// ========================================================

// Post a new job (Backend auto-assigns Recruiter ID via Principal)
export const createJob = async (jobData) => {
  const res = await API.post("/recruiter/jobs", jobData);
  return res.data;
};

// View jobs posted ONLY by this logged-in recruiter (THIS WAS MISSING)
export const getJobsByRecruiter = async () => {
  const res = await API.get("/recruiter/jobs");
  return res.data;
};

// Update an existing job's details
export const updateJobDetails = async (jobId, updatedData) => {
  const res = await API.put(`/recruiter/jobs/${jobId}`, updatedData);
  return res.data;
};

// Delete a job listing completely
export const deleteJobListing = async (jobId) => {
  const res = await API.delete(`/recruiter/jobs/${jobId}`);
  return res.data;
};
