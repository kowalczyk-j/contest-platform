import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Box, Select, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import Navbar from "./Navbar";
import BackButton from "./buttons/BackButton";
import EntryInfo from "./EntryInfo";
import EntryScore from "./EntryScore";
import ConfirmationWindow from "./ConfirmationWindow";

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [contest, setContest] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [reviewDeleteErrorMessage, setReviewDeleteErrorMessage] = useState("");

  const [maxScore, setMaxScore] = useState(10);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const { contestId } = useParams();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/entries/?contest=${contestId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        const entriesWithScores = response.data.map((entry) => {
          return axios
            .get(
              `${import.meta.env.VITE_API_URL}api/entries/${
                entry.id
              }/total_grade_value/`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Token " + sessionStorage.getItem("accessToken"),
                },
              }
            )
            .then((scoreResponse) => {
              return { ...entry, score: scoreResponse.data.total_value };
            });
        });

        Promise.all(entriesWithScores).then((completed) => {
          const sortedEntries = completed.sort((a, b) =>
            sortOrder === "asc" ? a.score - b.score : b.score - a.score
          );
          setEntries(sortedEntries);
        });
      })
      .catch((error) => console.error("Error fetching data: ", error));

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
      .get(
        `${
          import.meta.env.VITE_API_URL
        }api/contests/${contestId}/max_rating_sum/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        setMaxScore(response.data.total_max_rating);
      })
      .catch((error) => console.error("Error fetching max score: ", error));
  }, [contestId, sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleBackClick = () => {
    navigate("/");
  };
  // REQ_04
  const handleDeleteClick = (id) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}api/entries/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setEntries(entries.filter((entry) => entry.id !== id));
      })
      .catch((error) => {
        console.log(error);
        setReviewDeleteErrorMessage(
          JSON.stringify(error.response.data, null, 2)
        );
      });
    setOpenPopUp(true);
  };
  // REQ_04_END
  return (
    <ThemeProvider theme={montserrat}>
      <Navbar />
      <Box
        sx={{
          px: 4,
          maxWidth: "7xl",
          mx: "auto",
          "& .MuiCard-root": { maxWidth: "700px", mb: 2, mx: "auto" },
        }}
      >
        <Box sx={{ textAlign: "center", my: 2, mx: "auto" }}>
          {/* REQ_33 */}
          <Typography
            style={{ fontWeight: "bold", marginTop: "20px" }}
            variant="h4"
            component="h1"
          >
            Prace konkursowe: {contest.title}
          </Typography>
          <Select value={sortOrder} onChange={handleSortChange} sx={{ mt: 2 }}>
            <MenuItem value={"asc"}>
              Od nieocenionych/najniżej ocenionych
            </MenuItem>
            <MenuItem value={"desc"}>Od najwyżej ocenionych</MenuItem>
          </Select>
        </Box>
        <BackButton clickHandler={handleBackClick} />
        {/* REQ_33_END*/}
        {entries.map((entry) => {
          const badgeColor = getBadgeColor(entry.score, maxScore);
          return (
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
                title={entry.entry_title}
                name={entry.contestants[0].name}
                surname={entry.contestants[0].surname}
                date={entry.date_submitted}
                entryFile={entry.entry_file}
                userView={false}
                entry_file={entry.entry_file}
                onDeleteClick={handleDeleteClick}
                favourite={entry.favourite}
                canceled={entry.canceled}
              />
              {/* REQ_35 */}
              <EntryScore
                badgeColor={badgeColor}
                score={entry.score}
                maxScore={maxScore}
              />
              {/* REQ_35_END */}
            </Card>
          );
        })}
      </Box>
      <ConfirmationWindow
        open={openPopUp}
        setOpen={setOpenPopUp}
        title={
          reviewDeleteErrorMessage
            ? "Usuwanie zgłoszenia nieudane"
            : "Pomyślnie usunięto zgłoszenie"
        }
        message={reviewDeleteErrorMessage || null}
        onConfirm={() => setOpenPopUp(false)}
        showCancelButton={false}
      />
    </ThemeProvider>
  );
}

function getBadgeColor(score, maxScore) {
  if (score === null || score === undefined) {
    return "grey";
  } else if (score < 0.5 * maxScore) {
    return "#900020";
  } else if (score < 0.8 * maxScore) {
    return "#FFD700";
  } else {
    return "green";
  }
}
