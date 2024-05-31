import { useEffect, useState } from "react";
import { Typography, TextField, Card, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import GenerateTextButton from "./buttons/GenerateTextButton";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import BackButton from "./buttons/BackButton";
import ConfirmationWindow from "./ConfirmationWindow";

export default function CertificateForm() {
  const { contestId } = useParams();
  const [contest, setContest] = useState({});
  const navigate = useNavigate();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [resultOpened, setResultOpened] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCertificates = () => {
    setOpenPopUp(true);
  };

  const handleCancel = () => {
    setOpenPopUp(false);
  };

  const [formData1, setFormData1] = useState({
    participant: "",
    achievement: "",
    signature: "",
    signatory: "",
  });

  const [formData2, setFormData2] = useState({
    signature: "",
    signatory: "",
  });

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleSubmit1 = (event) => {
    event.preventDefault();
    const { participant, achievement, signature, signatory } = formData1;
    if (!participant || !achievement || !signature || !signatory) {
      alert("All fields are required.");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}api/contests/certificate`, {
        params: {
          contest: contest.title,
          participant: formData1.participant,
          achievement: formData1.achievement,
          signature: formData1.signature,
          signatory: formData1.signatory,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        alert("Error generating PDF. Please try again later.");
      });
  };

  const handleConfirm = () => {
    setOpenPopUp(false);
    const { signature, signatory } = formData2;
    if (!signature || !signatory) {
      alert("All fields are required.");
      return;
    }

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + sessionStorage.getItem("accessToken"),
      },
      responseType: "blob",
    };

    axios
      .post(
        `${import.meta.env.VITE_API_URL}api/contests/${
          contest.id
        }/send_certificates/`,
        {
          signature: formData2.signature,
          signatory: formData2.signatory,
        },
        headers
      )
      .then((response) => {
        setResultOpened(true);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Error sending certificate:", error);
        setResultOpened(true);
        setErrorMessage("Wystąpił błąd przy wysyłaniu certyfikatu.");
      });
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleCloseResult = () => {
    setResultOpened(false);
    setErrorMessage("");
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
            <form onSubmit={handleSubmit1} style={{ width: "100%" }}>
              <TextField
                fullWidth
                margin="normal"
                id="participant1"
                name="participant"
                label="Uczestnik"
                placeholder="Wprowadź imię i nazwisko"
                value={formData1.participant}
                onChange={handleChange1}
              />
              <TextField
                fullWidth
                margin="normal"
                id="achievement1"
                name="achievement"
                label="Osiągnięcie"
                placeholder="Wprowadź osiągnięcie"
                value={formData1.achievement}
                onChange={handleChange1}
              />
              <TextField
                fullWidth
                margin="normal"
                id="signature1"
                name="signature"
                label="Podpis"
                placeholder="Wprowadź podpis"
                value={formData1.signature}
                onChange={handleChange1}
              />
              <TextField
                fullWidth
                margin="normal"
                id="signatory1"
                name="signatory"
                label="Podpisujący"
                placeholder="Wprowadź imię i nazwisko podpisującego"
                value={formData1.signatory}
                onChange={handleChange1}
              />
              {/*REQ_18_END*/}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <GenerateTextButton
                  text="Wygeneruj dyplom"
                  onClick={handleSubmit1}
                />
              </Box>
            </form>

            {/* Drugi formularz */}
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mx: "auto", alignItems: "center", mt: "2rem" }}
            >
              Roześlij certyfikaty dla konkursu {contest.title}
            </Typography>
            <form onSubmit={handleCertificates} style={{ width: "100%" }}>
              <TextField
                fullWidth
                margin="normal"
                id="signature2"
                name="signature"
                label="Podpis"
                placeholder="Wprowadź podpis"
                value={formData2.signature}
                onChange={handleChange2}
              />
              <TextField
                fullWidth
                margin="normal"
                id="signatory2"
                name="signatory"
                label="Podpisujący"
                placeholder="Wprowadź imię i nazwisko podpisującego"
                value={formData2.signatory}
                onChange={handleChange2}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <GenerateTextButton
                  text="Roześlij dyplomy"
                  onClick={handleCertificates}
                />
              </Box>
            </form>
            <ConfirmationWindow
              open={openPopUp}
              setOpen={setOpenPopUp}
              title="Czy na pewno chcesz wysłać certyfikaty uznania?"
              message="Każdy uczestnik otrzyma certyfikat uznania za udział w konkursie"
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
            <ConfirmationWindow
              open={resultOpened}
              setOpen={setResultOpened}
              title={
                errorMessage
                  ? "Wystąpił błąd przy wysyłaniu certufikatu"
                  : "Wysłano certyfikaty"
              }
              message={errorMessage || ""}
              onConfirm={handleCloseResult}
              showCancelButton={false}
            />
          </Card>
        </Box>
      </ThemeProvider>
    </>
  );
}
