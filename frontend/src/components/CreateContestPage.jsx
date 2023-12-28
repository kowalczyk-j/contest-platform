import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Grid } from '@mui/material';
import 'reactjs-popup/dist/index.css'
import Header from './Header';
import BackButton from './BackButton';
import ContestForm from './ContestForm';


function CreateContestPage() {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}contests/`, {
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
  };

  const handleBack = () => { navigate("/"); };

  return (
    <div>
      <Header  />
      <div className="main">
        <div className="back-btn">
          <BackButton clickHandler={handleBack}/>
        </div>
        <div className="form">
          <ContestForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  )
}

export default CreateContestPage;