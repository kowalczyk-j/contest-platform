import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "./BackButton";
import montserrat from "../static/theme";

export default function Component() {
  const [entries, setEntries] = useState([]);
  const [contest, setContest] = useState({});
  const navigate = useNavigate();
  const { contestId } = useParams();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}entries/?contest=${contestId}`)
      .then((response) => setEntries(response.data))
      .catch((error) => console.error("Error fetching data: ", error));

    axios
      .get(`${import.meta.env.VITE_API_URL}contests/${contestId}/`)
      .then((response) => setContest(response.data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [contestId]);

  const handleBackClick = () => {
    navigate("/");
  };
  return (
    <ThemeProvider theme={montserrat}>
      <Box
        sx={{
          px: 4,
          maxWidth: "7xl",
          mx: "auto",
          "& .MuiCard-root": { maxWidth: "700px", mb: 2, mx: "auto" },
        }}
      >
        <Box sx={{ textAlign: "center", my: 2, mx: "auto" }}>
          <img
            alt="Logo"
            src="/Logo.png"
            style={{
              aspectRatio: "316/148",
              objectFit: "cover",
              marginBottom: "1%",
            }}
            height="148"
            width="316"
          />
          <Typography
            style={{ fontWeight: "bold" }}
            variant="h4"
            component="h1"
          >
            Prace konkursowe: {contest.title}
          </Typography>
        </Box>
        <BackButton clickHandler={handleBackClick} />
        {entries.map((entry) => (
          <Card
            key={entry.id}
            sx={{
              p: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              maxWidth: "50%",
              boxShadow: "0 0 3px 1px #95C21E",
            }}
          >
            <EntryInfo
              id={entry.id}
              name={entry.contestant_name}
              surname={entry.contestant_surname}
              age="12"
              school="Szkoła Podstawowa nr 1 w Głogowie"
            />
            <EntryScore badgeColor="success.main" score={22} />
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
}

function EntryInfo({ id, name, surname, age, school }) {
  return (
    <Box sx={{ mr: 2 }}>
      <Typography variant="h5" component="h2">
        <span className="green-bold">
          #{id} {name} {surname}
        </span>
      </Typography>
      <Typography variant="body1">
        <span className="green-bold">Wiek: </span>
        {age}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        <span className="green-bold">Jednostka koordynująca: </span> {school}
      </Typography>
    </Box>
  );
}

function EntryScore({ badgeColor, score }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: badgeColor,
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <Typography
          variant="body1"
          component="div"
          style={{ fontWeight: "bold" }}
        >
          {score}
        </Typography>
      </Box>
      <Typography variant="body2" component="div">
        suma
      </Typography>
    </Box>
  );
}
