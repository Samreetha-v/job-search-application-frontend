import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
