import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Box, Select, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import Navbar from "./Navbar";
import BackButton from "./BackButton";
import EntryInfo from "./EntryInfo";
import EntryScore from "./EntryScore";
import ConfirmationWindow from "./ConfirmationWindow";

export default function UserEntries() {
  const [entries, setEntries] = useState([]);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [reviewDeleteErrorMessage, setReviewDeleteErrorMessage] = useState("");

  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}api/users/current_user/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + sessionStorage.getItem("accessToken")
      }
    })
      .then((response) => {
        axios
          .get(`${import.meta.env.VITE_API_URL}api/entries/?user=${response.data.id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + sessionStorage.getItem("accessToken"),
            },
          })
          .then((response) => {
            const entriesWithScores = response.data.map((entry) => {
              return axios
                .get(
                  `${import.meta.env.VITE_API_URL}api/entries/${entry.id
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
              setLoading(false);
            });
          })
          .catch((error) => console.error("Error fetching data: ", error));
      })
      .catch(error => console.error("Error:", error));

  }, [sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleBackClick = () => {
    navigate("/");
  };

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

  if (loading) {
    return (<div></div>);
  };

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
          <Typography
            style={{ fontWeight: "bold", marginTop: "20px" }}
            variant="h4"
            component="h1"
          >
            Twoje zgłoszenia
          </Typography>
          <Select value={sortOrder} onChange={handleSortChange} sx={{ mt: 2 }}>
            <MenuItem value={"asc"}>
              Od nieocenionych/najniżej ocenionych
            </MenuItem>
            <MenuItem value={"desc"}>Od najwyżej ocenionych</MenuItem>
          </Select>
        </Box>
        <BackButton clickHandler={handleBackClick} />
        {entries.map((entry) => {
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
                name={"Michał"}
                surname={"Michałowski"}
                date={entry.date_submitted}
                score={entry.score}
                onDeleteClick={handleDeleteClick}
              />
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
