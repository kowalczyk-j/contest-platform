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
import SubmitButton from "./SubmitButton";
import GenerateTextButton from "./GenerateTextButton";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import ConfirmationWindow from "./ConfirmationWindow";

export default function EmailForm() {
  const { contestId } = useParams();
  const [contest, setContest] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [emailData, setEmailData] = useState({
    receivers: "",
    subject: "",
    message: "",
  });

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
      .catch((err) => console.error(err));
  };

  const generateEmailMessage = () => {
    const emailSubject = `Zaproszenie do udziału w konkursie "${contest.title}"`;
    const emailMessage = `Szanowni Państwo,

Zapraszamy serdecznie do wzięcia udziału w konkursie "${
      contest.title
    }" organizowanym przez Fundację "BoWarto". Konkurs ${
      contest.individual ? "indywidualny" : "zespołowy"
    }, ${contest.type} rozpoczyna się ${contest.date_start} i potrwa do ${
      contest.date_end
    }.

Opis:
${contest.description}

Zachęcamy do sprawdzenia szczegółów na naszej platformie: http://localhost:5173/contest/${
      contest.id
    }
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
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="receivers-label">Receivers</InputLabel>
                <Select
                  labelId="receivers-label"
                  id="receivers"
                  name="receivers"
                  value={emailData.receivers}
                  label="Receivers"
                  onChange={handleChange}
                >
                  <MenuItem value="all">All Subscribers</MenuItem>
                  <MenuItem value="new">New Subscribers</MenuItem>
                  <MenuItem value="inactive">Inactive Subscribers</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                id="subject"
                name="subject"
                label="Title"
                placeholder="Enter the title of your newsletter"
                value={emailData.subject}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="message"
                name="message"
                label="Message"
                placeholder="Enter the content of your newsletter"
                multiline
                rows={15}
                value={emailData.message}
                onChange={handleChange}
              />
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
          title="Pomyślnie wysłano maile"
          message=""
          onConfirm={() => setOpenPopUp(false)}
          showCancelButton={false}
        />
      </ThemeProvider>
    </>
  );
}
