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

  // Function to fetch initial data
  const fetchInitialData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/contests/${contestId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      );
      setInitialData(response.data); // Set initial data
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching initial data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData(); // Fetch initial data when component mounts
  }, [contestId]);

  const handleFormSubmit = async (formData) => {
    let criterion = formData.criterion;
    let contestResponse, criterionResponse;

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

        // Map criterion to promises and use Promise.all to wait for all to complete
        const criterionPromises = criterion.map((c) => {
          c.contest = contestId;
          return axios
            .post(`${import.meta.env.VITE_API_URL}api/criterions/`, c, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + sessionStorage.getItem("accessToken"),
              },
            })
            .then((response) => {
              if (response.status !== 201) {
                throw new Error("Network response was not ok");
              }
              console.log(JSON.stringify(c));
              const result = response.data;
              console.log(result);
              return response; // Return the response for each criterion
            });
        });

        // Wait for all criterion promises to resolve
        return Promise.all(criterionPromises).then((responses) => {
          criterionResponse = responses; // Store all criterion responses
          return { contestResponse, criterionResponse }; // Return the final result object
        });
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
          <ContestForm onSubmit={handleFormSubmit} initialData={initialData} />
        </div>
      </div>
    </div>
  );
}

export default EditContestPage;
