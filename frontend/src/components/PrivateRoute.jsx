import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const PrivateRoute = ({ children, forStaff, forJury, forAuthenticated }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const currentUserLink = `${import.meta.env.VITE_API_URL
      }api/users/current_user/`;
    const headersCurrentUser = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + accessToken,
      },
    };

    axios
      .get(currentUserLink, headersCurrentUser)
      .then((res) => {
        const responseData = res.data;
        setUserData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setLoading(false);
      });
  }, [accessToken]);

  if (loading) {
    return <CircularProgress />;
  }

  if (forStaff && !userData.is_staff) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (forJury && !userData.is_jury && !userData.is_staff) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (forAuthenticated && Object.keys(userData).length === 0) {
    console.log(userData);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
