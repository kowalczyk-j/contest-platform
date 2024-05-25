import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "reactjs-popup/dist/index.css";
import BackButton from "./buttons/BackButton";
import ContestForm from "./ContestForm";
import Navbar from "./Navbar";

function CreateContestPage() {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    let criterion = formData.criterion;
    let contestId;
    let contestResponse, criterionResponse;

    // Return the promise chain so that the calling function can await it
    return axios
      .post(`${import.meta.env.VITE_API_URL}api/contests/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.status !== 201) {
          throw new Error("Network response was not ok");
        }
        console.log(JSON.stringify(formData));
        const result = response.data;
        contestId = result.id;
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

  return (
    <div>
      <Navbar />
      <div className="main">
        <div className="back-btn">
          <BackButton clickHandler={handleBack} />
        </div>
        <div className="form">
          <ContestForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
}

export default CreateContestPage;
