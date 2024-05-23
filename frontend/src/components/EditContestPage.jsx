import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "reactjs-popup/dist/index.css";
import BackButton from "./buttons/BackButton";
import ContestForm from "./ContestForm";
import Navbar from "./Navbar";

function EditContestPage() {
  const { contestId } = useParams(); // Get the contest ID from the URL
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null); // State to hold initial data
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Function to fetch contest data
  const fetchContestData = async () => {
    try {
      const contestResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}api/contests/${contestId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      );
      const contestData = contestResponse.data;
      setInitialData(contestData); // Set initial data
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching initial data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContestData(); // Fetch initial data when component mounts
  }, [contestId]);

  const handleFormSubmit = async (formData) => {
    let contestResponse;

    // Return the promise chain so that the calling function can await it
    return axios
      .put(
        `${import.meta.env.VITE_API_URL}api/contests/${contestId}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        console.log(JSON.stringify(formData));
        const result = response.data;
        console.log(result);
        contestResponse = response;
        return { contestResponse }; // Return the final result object
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while data is being fetched
  }

  return (
    <div>
      <Navbar />
      <div className="main">
        <div className="back-btn">
          <BackButton clickHandler={handleBack} />
        </div>
        <div className="form">
          <ContestForm
            onSubmit={handleFormSubmit}
            initialData={initialData}
            editingMode={true}
          />
        </div>
      </div>
    </div>
  );
}

export default EditContestPage;
