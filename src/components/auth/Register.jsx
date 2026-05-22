import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../actions/auth";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_JOBSEEKER",
  });

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData, navigate));
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Create an Account
      </h2>
      <p
        style={{
          textAlign: "center",
          color: "var(--text-muted)",
          marginBottom: "30px",
        }}
      >
        Join us and find your next opportunity
      </p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="johndoe@example.com"
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
            placeholder="Create a secure password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <select name="role" value={role} onChange={onChange}>
            <option value="ROLE_JOBSEEKER">Candidate (Looking for jobs)</option>
            <option value="ROLE_RECRUITER">
              Employer / Recruiter (Posting jobs)
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary"
          style={{ width: "100%", marginTop: "10px", padding: "12px" }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
