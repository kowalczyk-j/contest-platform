import { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Card,
  Box,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import GenerateTextButton from "./buttons/GenerateTextButton";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import BackButton from "./buttons/BackButton";

export default function CertificateForm() {
  const { contestId } = useParams();
  const [contest, setContest] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    participant: '',
    achievement: '',
    signature: '',
    signatory: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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

  const handleSubmit = (event) => {
      event.preventDefault();
      const { participant, achievement, signature, signatory } = formData;
        if (!participant || !achievement || !signature || !signatory) {
        alert('All fields are required.');
        return;
        }
      axios
          .get(
              `${import.meta.env.VITE_API_URL}api/contests/certificate?contest=${contest.title}&participant=${formData.participant}&achievement=${formData.achievement}&signature=${formData.signature}&signatory=${formData.signatory}`,
              {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: "Token " + sessionStorage.getItem("accessToken"),
                  },
              }
          )
          .then((response) => {
              const file = new Blob([response.data], { type: 'application/pdf' });
              const fileURL = URL.createObjectURL(file);
              window.open(fileURL);
          })
          .catch((error) => {
              console.error('Error generating PDF:', error);
              alert('Error generating PDF. Please try again later.');
          })
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
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
              maxWidth: "65%",
              minWidth: "50%",
              boxShadow: "0 0 3px 1px #95C21E",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mx: "auto", alignItems: "center" }}
            >
              Wypełnij dane dyplomu {contest.title}
            </Typography>
            {/*REQ_18*/}
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
                fullWidth
                margin="normal"
                id="participant"
                name="participant"
                label="Uczestnik"
                placeholder="Wprowadź imię i nazwisko"
                value={formData.participant}
                onChange={handleChange}
            />
            <TextField
                fullWidth
                margin="normal"
                id="achievement"
                name="achievement"
                label="Osiągnięcie"
                placeholder="Wprowadź osiągnięcie"
                value={formData.achievement}
                onChange={handleChange}
            />
            <TextField
                fullWidth
                margin="normal"
                id="signature"
                name="signature"
                label="Podpis"
                placeholder="Wprowadź podpis"
                value={formData.signature}
                onChange={handleChange}
            />
            <TextField
                fullWidth
                margin="normal"
                id="signatory"
                name="signatory"
                label="Podpisujący"
                placeholder="Wprowadź imię i nazwisko podpisującego"
                value={formData.signatory}
                onChange={handleChange}
            />
              {/*REQ_18_END*/}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <GenerateTextButton
                  text="Wygeneruj dyplom"
                  onClick={handleSubmit}
                />
              </Box>
            </form>
          </Card>
        </Box>
      </ThemeProvider>
    </>
  );
}
