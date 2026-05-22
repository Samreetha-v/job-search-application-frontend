// src/services/applicationService.js
import API from "../api";

// ========================================================
// JOBSEEKER ACTION ENDPOINTS
// ========================================================

export const applyForJob = async (jobId, resumeLink) => {
  // Matches @PostMapping("/apply/{jobId}") with @RequestParam String resumeLink
  const res = await API.post(
    `/jobseeker/apply/${jobId}?resumeLink=${encodeURIComponent(resumeLink)}`,
  );
  return res.data;
};

export const getUserApplications = async () => {
  const res = await API.get("/jobseeker/applications");
  return res.data;
};

// ========================================================
// RECRUITER ACTION ENDPOINTS (Wired to RecruiterController)
// ========================================================

// 1. Get all applicants for a specific job ID
export const getJobApplicants = async (jobId) => {
  const res = await API.get(`/recruiter/jobs/${jobId}/applicants`);
  return res.data;
};

// 2. Update status (APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED)
export const updateApplicationStatus = async (appId, statusString) => {
  const res = await API.put(
    `/recruiter/applications/${appId}/status?status=${statusString}`,
  );
  return res.data;
};
