import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const admin = JSON.parse(localStorage.getItem("adminLoggedIn"));

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default PrivateRoute;
