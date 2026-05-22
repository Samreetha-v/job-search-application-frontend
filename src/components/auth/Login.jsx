import { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { login } from "../../actions/auth";

const Login = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [redirect, setRedirect] = useState(false);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await dispatch(login(formData));
    if (success) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="form-container">
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Welcome Back
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "var(--text-muted)",
          marginBottom: "30px",
        }}
      >
        Log in to your account to continue
      </p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: "100%", marginTop: "10px", padding: "12px" }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
