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
    <div style={{ padding: "30px" }}>
      <h2>Login</h2>

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

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
