import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // If user is authenticated but does not have the right role, redirect to home
  if (user && allowedRoles && !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
