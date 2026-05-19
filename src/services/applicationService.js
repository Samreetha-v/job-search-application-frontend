// src/services/applicationService.js
import API from "../api";

// Fetch applications for a specific job seeker
export const getUserApplications = async (userId) => {
  // Assuming your backend has an endpoint like this:
    const res = await API.get(`/applications/candidate/${userId}`);
    return res.data;
};
