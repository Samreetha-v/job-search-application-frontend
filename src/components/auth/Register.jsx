import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../actions/auth";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // 1. Added 'role' to the initial state (defaulting to CANDIDATE)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_JOBSEEKER",
  });

  // 2. Destructure 'role' so we can use it in the form
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
    <div style={{ padding: "30px" }}>
      <h2>Register</h2>

      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={onChange}
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
        />

        {/* 3. Added a dropdown for the Role */}
        <select
          name="role"
          value={role}
          onChange={onChange}
          style={{ padding: "5px" }}
        >
          <option value="ROLE_JOBSEEKER">Candidate</option>
          <option value="ROLE_RECRUITER">Employer / Recruiter</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
