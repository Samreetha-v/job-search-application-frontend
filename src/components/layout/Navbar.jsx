import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated, user } = auth;

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // 1. Links to show to everyone (Unauthenticated guests)
  const guestLinks = (
    <>
      <Link to="/jobs" className="nav-item">
        Explore Jobs
      </Link>
      <Link to="/login" className="nav-item">
        Login
      </Link>
      <Link to="/register" className="btn-primary">
        Register
      </Link>
    </>
  );

  // 2. Links to show to candidates (ROLE_JOBSEEKER)
  const candidateLinks = (
    <>
      <Link to="/jobs" className="nav-item">
        Browse Jobs
      </Link>
      <Link to="/dashboard" className="nav-item">
        Dashboard
      </Link>
      <button onClick={onLogout} className="btn-secondary">
        Logout
      </button>
    </>
  );

  // 3. Links to show to recruiters (ROLE_RECRUITER)
  const recruiterLinks = (
    <>
      <Link to="/dashboard" className="nav-item">
        Dashboard
      </Link>
      <Link to="/post-job" className="nav-item highlight-link">
        + Post a Job
      </Link>
      <button onClick={onLogout} className="btn-secondary">
        Logout
      </button>
    </>
  );

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Job<span>Portal</span>
        </Link>

        <div className="nav-links">
          {!isAuthenticated
            ? guestLinks
            : user?.role === "ROLE_RECRUITER"
              ? recruiterLinks
              : candidateLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
