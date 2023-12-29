import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'reactjs-popup/dist/index.css'
import Header from './Header';
import BackButton from './BackButton';
import ContestForm from './ContestForm';


function CreateContestPage() {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    let criterion = formData.criterion;
    let contestId;
    let contestResponse, criterionResponse;

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
      contestId = result.id;
      console.log(result);
      contestResponse = response;
    } catch (error) {
      console.error('Error:', error);
    }

    for (const c of criterion) {
      try {
        c.contest = contestId;
        const response = await fetch(`${import.meta.env.VITE_API_URL}assessment-criterion/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(c),
        });
        console.log(JSON.stringify(c));
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);
        criterionResponse = response;
      } catch (error) {
        console.error('Error:', error);
      }
    }
    return {contestResponse, criterionResponse};
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