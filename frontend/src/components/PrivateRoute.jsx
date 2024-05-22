import { useState, useEffect } from "react";
import { useLocation, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const PrivateRoute = ({
  children,
  forStaff,
  forJury,
  forAuthenticated,
  checkContestStatus,
}) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [contestData, setContestData] = useState(null);
  const location = useLocation();
  const { contestId } = useParams(); // Pobieranie contestId z URL
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const fetchContestData = async () => {
      if (contestId) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}api/contests/${contestId}/`
          );
          setContestData(response.data);
        } catch (error) {
          console.error("Error fetching contest data:", error);
        }
      }
    };

    fetchContestData();
  }, [contestId]);

  useEffect(() => {
    const currentUserLink = `${
      import.meta.env.VITE_API_URL
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    checkContestStatus &&
    contestId &&
    contestData?.status !== "ongoing" &&
    !userData.is_jury &&
    !userData.is_staff
  ) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
