import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import FileDownloadButton from "./FileDownloadButton";
import Navbar from "./Navbar";
import BackButton from "./BackButton";

export default function EntryWorkView() {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const [entryData, setEntryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/entries/${entryId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        }
      })
      .then((response) => {
        setEntryData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching entry data: ", error);
        setLoading(false);
      });
  }, [entryId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Navbar />
      <BackButton clickHandler={handleBackClick} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
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
            maxWidth: "70%",
            boxShadow: "0 0 3px 1px #95C21E",
          }}
        >
          <CardContent sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {entryData.entry_file ? (
                <img
                  src={entryData.entry_file}
                  alt="Nie można wyświetlić tej pracy. Pobierz plik."
                  style={{ maxWidth: "600px", width: "100%", height: "auto" }} // Adjusted size for images
                />
              ) : (
                <Typography variant="body1" component="div">
                  Zgłoszenie nie zawiera żadnego dołączonego pliku. Praca mogła
                  zostać dostarczona jedynie w formie fizycznej.
                </Typography>
              )}
            </Box>
          </CardContent>
          <FileDownloadButton
            text="Pobierz pracę"
            link={entryData.entry_file}
          />
        </Card>
      </Box>
    </>
  );
}
