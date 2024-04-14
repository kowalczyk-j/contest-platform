import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import Navbar from "./Navbar";
import BackButton from "./buttons/BackButton";
import EntryInfo from "./EntryInfo";

export default function UserEntries() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/users/current_user/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        axios
          .get(
            `${import.meta.env.VITE_API_URL}api/entries/?user=${response.data.id
            }`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Token " + sessionStorage.getItem("accessToken"),
              },
            }
          )
          .then((response) => {
            const entriesWithContest = response.data.map((entry) => {
              return axios
                .get(
                  `${import.meta.env.VITE_API_URL}api/contests/${entry.contest
                  }/`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization:
                        "Token " + sessionStorage.getItem("accessToken"),
                    },
                  }
                )
                .then((contestResponse) => {
                  return { ...entry, contestTitle: contestResponse.data.title };
                });
            });

            Promise.all(entriesWithContest).then((completed) => {
              setEntries(completed);
              setLoading(false);
            });
          })
          .catch((error) => console.error("Error fetching data: ", error));
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
                name={entry.contestTitle}
                date={entry.date_submitted}
                entryFile={entry.entry_file}
                userView={true}
                contestTitle={entry.contestTitle}
                entry_file={entry.entry_file}
              />
            </Card>
          );
        })}
      </Box>
    </ThemeProvider>
  );
}
