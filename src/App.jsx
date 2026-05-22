import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Jobs from "./components/jobs/Jobs";
import JobDetails from "./components/job/JobDetails";
import Dashboard from "./components/dashboard/Dashboard";
import NotFound from "./components/layout/NotFound";
import PrivateRoute from "./components/routing/PrivateRoute.jsx";
import PostJob from "./components/jobs/PostJob";
import JobApplicants from "./components/recruiter/JobApplicants";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* ========================================================
            PUBLIC ROUTES (Anyone can access)
           ======================================================== */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />

        {/* ========================================================
            GENERAL PROTECTED ROUTES (Any logged-in user)
           ======================================================== */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ========================================================
            JOBSEEKER ONLY ROUTES (Synced with JobSeekerController)
           ======================================================== */}
        <Route 
          path="/jobs/:id" 
          element={
            <PrivateRoute allowedRoles={["ROLE_JOBSEEKER"]}>
              <JobDetails />
            </PrivateRoute>
          } 
        />

        {/* ========================================================
            RECRUITER ONLY ROUTES (Synced with RecruiterController)
           ======================================================== */}
        <Route 
          path="/post-job" 
          element={
            <PrivateRoute allowedRoles={["ROLE_RECRUITER"]}>
              <PostJob />
            </PrivateRoute>
          } 
        />
        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={
            <PrivateRoute allowedRoles={["ROLE_RECRUITER"]}>
              <JobApplicants />
            </PrivateRoute>
          }
        />

        {/* ========================================================
            CATCH-ALL FALLBACK (404)
           ======================================================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;