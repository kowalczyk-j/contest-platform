import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import BackButton from "./BackButton";
import EntryForm from "./EntryForm";

function CreateEntryPage() {
  const navigate = useNavigate();

  const { contestId } = useParams();

  const handleFormSubmit = async (formData) => {
    let response;
    try {
      response = await fetch(`${import.meta.env.VITE_API_URL}api/entries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(JSON.stringify(formData));
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
    return response;
  };

  const handleBack = () => { navigate("/"); };

  return (
    <div>
      <Header />
      <div className="main">
        <div className="back-btn">
          <BackButton clickHandler={handleBack} />
        </div>
        <div className="form">
          <EntryForm contestId={contestId} onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  )
}

export default CreateEntryPage;