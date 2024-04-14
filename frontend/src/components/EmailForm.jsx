import { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  Box,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import SubmitButton from "./buttons/SubmitButton";
import GenerateTextButton from "./buttons/GenerateTextButton";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import ConfirmationWindow from "./ConfirmationWindow";
import BackButton from "./buttons/BackButton";

export default function EmailForm() {
  const { contestId } = useParams();
  const [contest, setContest] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [emailData, setEmailData] = useState({
    receivers: "",
    subject: "",
    message: "",
  });
  const [emailList, setEmailList] = useState([]);
  const [emailSendingError, setEmailSendingError] = useState("");
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
    // REQ_05
    axios
      .get(`${import.meta.env.VITE_API_URL}api/users/emails/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => setEmailList(response.data))
      .catch((error) => console.error("Error fetching email list: ", error));
    // REQ_05_END
  }, [contestId]);

  const handleChange = (event) => {
    setEmailData({ ...emailData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_API_URL}api/contests/1/send_email/`,
        emailData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      )
      .then((res) => console.log(res.data))
      .catch((error) => {
        console.log(error);
        setEmailSendingError(JSON.stringify(error.response.data, null, 2));
      });
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const generateEmailMessage = () => {
    const emailSubject = `Zaproszenie do udziału w konkursie "${contest.title}"`;
    const emailMessage = `Szanowni Państwo,

Zapraszamy serdecznie do wzięcia udziału w konkursie "${
      contest.title
    }" organizowanym przez Fundację "BoWarto". Konkurs ${
      contest.individual ? "indywidualny" : "zespołowy"
    } rozpoczyna się ${contest.date_start} i potrwa do ${contest.date_end}.

Opis:
${contest.description}

Zachęcamy do sprawdzenia szczegółów na naszej platformie: http://localhost:5173
Czekamy na Państwa zgłoszenia!

Z poważaniem,
Zespół Fundacji "BoWarto"`;

    setEmailData({
      ...emailData,
      message: emailMessage,
      subject: emailSubject,
    });
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
              Newsletter konkursu {contest.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, mx: 5 }}>
              Maksymalna liczba wysłanych maili wynosi 500 dziennie. W przypadku
              gdy wybrana lista liczy więcej odbiorców, system wyśle wiadomość
              do pierwszych 500 osób.
            </Typography>
            {/*REQ_18*/}
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="receivers-label">Odbiorcy</InputLabel>
                <Select
                  labelId="receivers-label"
                  id="receivers"
                  name="receivers"
                  value={emailData.receivers}
                  label="Receivers"
                  onChange={handleChange}
                >
                  <MenuItem value={emailList}>Wszyscy odbiorcy z bazy</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                id="subject"
                name="subject"
                label="Tytuł"
                placeholder="Wprowadź tytuł newslettera"
                value={emailData.subject}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="message"
                name="message"
                label="Treść e-mail"
                placeholder="Wpisz treść wiadomości"
                multiline
                rows={15}
                value={emailData.message}
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
                <SubmitButton
                  text="Wyślij"
                  onClick={() => setOpenPopUp(true)}
                />
                <GenerateTextButton
                  text="Wygeneruj treść"
                  onClick={generateEmailMessage}
                />
              </Box>
            </form>
          </Card>
        </Box>
        <ConfirmationWindow
          open={openPopUp}
          setOpen={setOpenPopUp}
          title={
            emailSendingError
              ? "Wysyłka maili nie powiodła się."
              : "Pomyślnie wysłano maile"
          }
          message={
            emailSendingError
              ? "Sprawdź ustawienia poczty"
              : "Zostaniesz przeniesiony do strony głównej"
          }
          onConfirm={() => {
            setOpenPopUp(false);
            emailSendingError ? null : handleBackClick();
          }}
          showCancelButton={false}
        />
      </ThemeProvider>
    </>
  );
}
