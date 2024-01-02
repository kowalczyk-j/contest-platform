import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import BackButton from "./BackButton";
import montserrat from "../static/theme";
import EntryInfo from "./EntryInfo";
import EntryScore from "./EntryScore";

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [contest, setContest] = useState({});
  const navigate = useNavigate();
  const { contestId } = useParams();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/entries/?contest=${contestId}`)
      .then((response) => setEntries(response.data))
      .catch((error) => console.error("Error fetching data: ", error));

    axios
      .get(`${import.meta.env.VITE_API_URL}api/contests/${contestId}/`)
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
          <Header />
          <Typography
            style={{ fontWeight: "bold", marginTop: "20px" }}
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
