import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'reactjs-popup/dist/index.css'
import Header from './Header';
import BackButton from './BackButton';
import ContestForm from './ContestForm';
import axios from "axios";


function CreateContestPage() {
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    let criterion = formData.criterion;
    let contestId;
    let contestResponse, criterionResponse;


    axios.post(`${import.meta.env.VITE_API_URL}api/contests/`, formData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + sessionStorage.getItem("accessToken")
        }
      }).then(response => {
        if (response.status === 200) {
          console.log(response.data);
          contestId = response.json().id;
          contestResponse = response;

        } else {
          console.log(response)
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

    for (const c of criterion) {
      c.contest = contestId;
      axios.post(`${import.meta.env.VITE_API_URL}api/assessment-criterion/`, c, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => {
        if (response.status === 200) {
          console.log(JSON.stringify(c))
        }
        else {
          throw new Error('Network response was not ok');
        }
      }).catch(error => {
        console.error('Error:', error);
      });
      criterionResponse = response;
      console.log(response.json());
    }

    const handleBack = () => { navigate("/"); };

    return (
      <div>
        <Header />
        <div className="main">
          <div className="back-btn">
            <BackButton clickHandler={handleBack} />
          </div>
          <div className="form">
            <ContestForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
    )
  }
};

export default CreateContestPage;