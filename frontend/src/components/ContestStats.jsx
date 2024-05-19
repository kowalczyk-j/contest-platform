import axios from "axios";
import { Typography, Box, Card } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Doughnut, Line } from "react-chartjs-2";

import Navbar from "./Navbar.jsx";
import BackButton from "./buttons/BackButton.jsx";

defaults.responsive = true;

const ContestStats = () => {
    const { contestId } = useParams();
    const [contest, setContest] = useState({});
    const [submissionTypeCount, setSubmissionTypeCount] = useState({});
    const [contestantCount, setContestantCount] = useState({});
    const [dailySubmissions, setDailySubmissions] = useState({ daily_entries: [] });
    const [entryAmount, setEntryAmount] = useState({});
    const navigate = useNavigate();

    defaults.plugins.title.display = true;
    defaults.plugins.title.align = "center";
    defaults.plugins.title.font.size = 20;
    defaults.plugins.title.font.color = "black";

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

        axios
            .get(`${import.meta.env.VITE_API_URL}api/contests/${contestId}/group_individual_comp/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + sessionStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                setSubmissionTypeCount(response.data);
            })
            .catch((error) => console.error("Error fetching submission type: ", error));

        axios
            .get(`${import.meta.env.VITE_API_URL}api/contests/${contestId}/get_contestants_amount/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + sessionStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                setContestantCount(response.data);
            })
            .catch((error) => console.error("Error fetching contestant amount: ", error));

        axios
            .get(`${import.meta.env.VITE_API_URL}api/contests/${contestId}/get_submissions_by_day/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + sessionStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                setDailySubmissions(response.data);
            })
            .catch((error) => console.error("Error fetching daily submissions: ", error));

        axios
            .get(`${import.meta.env.VITE_API_URL}api/contests/${contestId}/get_entry_amount/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + sessionStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                setEntryAmount(response.data);
            })
            .catch((error) => console.error("Error fetching entry amount: ", error));
    }, [contestId]);

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div>
            <Navbar />
            <BackButton clickHandler={handleBackClick} />
            <ThemeProvider theme={montserrat}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 4,
                    }}
                >
                    <Card
                        sx={{
                            p: 4,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                            maxWidth: "80%",
                            minWidth: "65%",
                            boxShadow: "0 0 3px 1px #95C21E",
                        }}
                    >
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ mx: "auto", alignItems: "center" }}
                        >
                            Statystki konkursu {contest.title}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1, mx: 5, alignItems: "center", }} style={{ wordWrap: "break-word" }}>
                            Liczba uczestników: {contestantCount.contestant_amount} <br />
                            Liczba nadesłanych prac: {entryAmount.entry_amount}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                mt: 4,
                            }}
                        >
                            <Box sx={{ flex: 1, paddingRight: 2 }}>
                                <Doughnut
                                    data={{
                                        labels: ["Prace indywidualne", "Prace grupowe"],
                                        datasets: [
                                            {
                                                data: [submissionTypeCount.solo_entries, submissionTypeCount.group_entries],
                                                backgroundColor: [
                                                    "rgba(43, 63, 229, 0.8)",
                                                    "rgba(250, 192, 19, 0.8)",
                                                ],
                                                borderRadius: 5,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                text: "Prace indywidualne kontra prace grupowe",
                                            },
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 2, paddingLeft: 2 }}>
                                {dailySubmissions.daily_entries.length > 0 && (
                                    <Line
                                        data={{
                                            labels: dailySubmissions.daily_entries.map(entry => entry.date_submitted),
                                            datasets: [
                                                {
                                                    label: "Ilość prac",
                                                    data: dailySubmissions.daily_entries.map(entry => entry.entry_count),
                                                    borderColor: 'rgba(255,48,48,1)',
                                                    backgroundColor: 'rgba(255,48,48,0.2)',
                                                    fill: true,
                                                },
                                            ],
                                        }}
                                        options={{
                                            plugins: {
                                                title: {
                                                    text: "Dziennie dodawane prace",
                                                },
                                            },
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </ThemeProvider>
        </div>
    );
};

export default ContestStats;
