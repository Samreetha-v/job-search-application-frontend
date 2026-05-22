// src/services/resumeService.js
import API from "../api";

export const uploadResumeFile = async (fileObject) => {
  const formData = new FormData();
  formData.append("file", fileObject); // Must match @RequestParam("file") in ResumeController

  const res = await API.post("/upload/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Vital override for binary streams
    },
  });
  return res.data; // This returns the raw "Resume uploaded successfully: filename" string
};
