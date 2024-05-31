import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "./buttons/BackButton";
import Navbar from "./Navbar";
import EntryForm from "./EntryForm";

function CreateEntryPage() {
  const navigate = useNavigate();

  const { contestId } = useParams();

  const handleFormSubmit = async (formData) => {
    return axios
      .post(`${import.meta.env.VITE_API_URL}api/entries/`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(JSON.stringify(formData));
        if (response && response.status !== 201) {
          throw new Error("Network response was not ok");
        }
        console.log(response.data);
        return response;
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
        {/* # REQ_22 */}
        <div className="form">
          <EntryForm contestId={contestId} onSubmit={handleFormSubmit} />
        </div>
        {/* # REQ_22_END */}
      </div>
    </div>
  );
}

export default CreateEntryPage;
