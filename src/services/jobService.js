// src/services/jobService.js
import API from "../api";

// Create a new job (Recruiter Only)
export const createJob = async (jobData) => {
  const res = await API.post("/jobs", jobData);
  return res.data;
};

// Get all jobs (Both roles)
export const getAllJobs = async () => {
  const res = await API.get("/jobs");
  return res.data;
};

// Get single job by ID
export const getJobById = async (id) => {
  const res = await API.get(`/jobs/${id}`);
  return res.data;
};

// Get jobs posted by a specific recruiter
export const getJobsByRecruiter = async (recruiterId) => {
  const res = await API.get(`/jobs/recruiter/${recruiterId}`);
  return res.data;
};
