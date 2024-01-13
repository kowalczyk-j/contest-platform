import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, forStaff, forJury }) => {
  const [userData, setUserData] = useState(
    JSON.parse(sessionStorage.getItem("userData")) || {}
  );
  const location = useLocation();

  if (forStaff && !userData.is_staff) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (forJury && !userData.is_jury && !userData.is_staff) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
