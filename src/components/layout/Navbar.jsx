import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../actions/auth";

const Navbar = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <nav
      style={{
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        background: "#222",
      }}
    >
      <h2 style={{ color: "#fff" }}>Job Portal</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "#fff" }}>
          Home
        </Link>

        <Link to="/jobs" style={{ color: "#fff" }}>
          Jobs
        </Link>

        {auth.token ? (
          <>
            <Link to="/dashboard" style={{ color: "#fff" }}>
              Dashboard
            </Link>

            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "#fff" }}>
              Login
            </Link>

            <Link to="/register" style={{ color: "#fff" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
