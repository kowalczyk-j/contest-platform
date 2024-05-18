import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import ConfirmationWindow from "./ConfirmationWindow";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import Navbar from "./Navbar.jsx";
import BackButton from "./buttons/BackButton.jsx";


const ContestStats = () => {
    const { contestId } = useParams();
    const [contest, setContest] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}api/contests/${contestId}/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + sessionStorage.getItem("accessToken"),
                },
            })
            .then((response) => setContest(response.data))
            .catch((error) => console.error("Error fetching data: ", error));
    }, [contestId]);

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div>
            <Navbar />
            <BackButton clickHandler={handleBackClick} />
        </div>
    );
};
export default ContestStats;
