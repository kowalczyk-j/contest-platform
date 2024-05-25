import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import TextButton from "./buttons/TextButton";
import ConfirmationWindow from "./ConfirmationWindow";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const GreenButton = styled(Button)({
  backgroundColor: "#95C21E",
  color: "white",
  "&:hover": {
    backgroundColor: "#82a819",
  },
});

const statusColors = {
  not_started: "#ff9800", // pomarańczowy
  ongoing: "#4caf50", // zielony
  judging: "#2196f3", // niebieski
  finished: "#f44336", // czerwony
};

const statusLabels = {
  not_started: "Nierozpoczęty",
  ongoing: "W trakcie trwania",
  judging: "W trakcie oceny",
  finished: "Zakończony",
};

const getContestStatus = (contest) => {
  const status = statusLabels[contest.status];
  return <span style={{ color: "white", fontWeight: "bold" }}>{status}</span>;
};

const ContestIndexPage = () => {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [openPopUpBeforeDelete, setOpenPopUpBeforeDelete] = useState(false);
  const [contestToDelete, setContestToDelete] = useState(null);
  const [openPopUpAfterDelete, setOpenPopUpAfterDelete] = useState(false);
  const [reviewDeleteErrorMessage, setReviewDeleteErrorMessage] = useState("");
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    let contestsLink = `${import.meta.env.VITE_API_URL}api/contests`;
    const headers = { headers: { "Content-Type": "application/json" } };
    const currentUserLink = `${
      import.meta.env.VITE_API_URL
    }api/users/current_user/`;
    const headersCurrentUser = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + accessToken,
      },
    };
    axios
      .get(contestsLink, headers)
      .then((ret) => setContests(ret.data))
      .catch((error) => console.error("Error:", error));

    axios
      .get(currentUserLink, headersCurrentUser)
      .then((res) => {
        const responseData = res.data;
        setUserData(responseData);
        if (responseData.is_staff || responseData.is_jury) {
          contestsLink = `${import.meta.env.VITE_API_URL}api/contests/`;
          axios
            .get(contestsLink, headers)
            .then((ret) => setContests(ret.data))
            .catch((error) => console.error("Error:", error));
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  const handleContestClick = (contest) => {
    setSelectedContest(contest);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const openConfirmationDialog = (contest) => {
    setContestToDelete(contest);
    setOpenPopUpBeforeDelete(true);
  };

  const handleClosePopUpAfterDelete = () => {
    setOpenPopUpAfterDelete(false);
    if (reviewDeleteErrorMessage === "") {
      setModalOpen(false);
    } else {
      setReviewDeleteErrorMessage("");
    }
  };

  const handleDeleteContest = async () => {
    if (!contestToDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}api/contests/${
          contestToDelete.id
        }/delete_with_related/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + accessToken,
          },
        }
      );

      setContests(
        contests.filter((contest) => contest.id !== contestToDelete.id)
      );
      setOpenPopUpBeforeDelete(false);
      setOpenPopUpAfterDelete(true);
    } catch (error) {
      console.error(error);
      setReviewDeleteErrorMessage(JSON.stringify(error.response.data, null, 2));
      setOpenPopUpAfterDelete(true);
    }
  };

  return (
    <div>
      <Navbar></Navbar>

      <Typography
        variant="h3"
        align="center"
        gutterBottom
        style={{ marginTop: "20px" }}
      >
        Aktywne konkursy
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          {userData.is_staff ? (
            <Card
              style={{
                width: "300px",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardContent>
                <Link to={"/create-contest"} style={{ textDecoration: "none" }}>
                  <TextButton
                    className="contest-title"
                    style={{
                      flex: 0.5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "1.5rem",
                      color: "#95C21E",
                    }}
                  >
                    Dodaj konkurs
                  </TextButton>
                </Link>
              </CardContent>
            </Card>
          ) : null}
        </Grid>

        {contests.map((contest) => (
          <Grid item key={contest.id}>
            <Card
              style={{
                width: "300px",
                height: "400px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  flex: 0.9,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {contest.poster_img && (
                  <img
                    src={contest.poster_img}
                    alt="Contest"
                    style={{ maxHeight: "350px", maxWidth: "300px" }}
                  />
                )}
              </div>
              <div
                style={{
                  flex: 0.1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextButton
                  className="contest-title"
                  onClick={() => handleContestClick(contest)}
                  style={{
                    fontSize: "1rem",
                    color: "#95C21E",
                  }}
                >
                  Zobacz więcej
                </TextButton>
              </div>{" "}
              <div
                style={{
                  flex: 0.1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#777",
                  fontSize: "0.8rem",
                  backgroundColor: statusColors[contest.status], // Ustawienie koloru tła
                  borderRadius: "5px",
                }}
              >
                {getContestStatus(contest)}
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle style={{ fontSize: "1.8rem" }}>
          {selectedContest?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" style={{ marginBottom: "10px" }}>
            Data rozpoczęcia: {selectedContest?.date_start}
          </Typography>
          <Typography variant="subtitle1" style={{ marginBottom: "10px" }}>
            Data zakończenia: {selectedContest?.date_end}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: "10px" }}>
            {selectedContest?.description}
          </Typography>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {selectedContest?.rules_pdf && (
              <TextButton
                style={{ fontSize: "1rem", color: "#95C21E" }}
                endIcon={<ArrowForwardIcon />}
                href={selectedContest?.rules_pdf}
              >
                Regulamin
              </TextButton>
            )}

            {userData.is_jury || userData.is_staff ? (
              <Link
                to={`/entries/${selectedContest?.id}`}
                style={{ textDecoration: "none" }}
              >
                <TextButton
                  style={{ fontSize: "1rem", color: "#95C21E" }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Nadesłane prace
                </TextButton>
              </Link>
            ) : null}

            {userData.is_staff ? (
              <Link
                to={`/contest/${selectedContest?.id}/email`}
                style={{ textDecoration: "none" }}
              >
                <TextButton
                  style={{ fontSize: "1rem", color: "#95C21E" }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Wysyłka maili
                </TextButton>
              </Link>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions>
          {/* # REQ_21 */}
          {selectedContest?.status === "ongoing" ? (
            <Link to={`/create-entry/${selectedContest?.id}`}>
              <GreenButton>
                <Typography align="center" style={{ color: "white" }}>
                  Weź udział
                </Typography>
              </GreenButton>
            </Link>
          ) : (
            userData.is_staff && (
              <Link to={`/create-entry/${selectedContest?.id}`}>
                <GreenButton>
                  <Typography align="center" style={{ color: "white" }}>
                    Dodaj zgłoszenie poza terminem
                  </Typography>
                </GreenButton>
              </Link>
            )
          )}
          {userData.is_staff && (
            <Link to={`/edit-contest/${selectedContest?.id}`}>
              <GreenButton>
                <Typography align="center" style={{ color: "white" }}>
                  Edytuj
                </Typography>
              </GreenButton>
            </Link>
          )}
          {userData.is_staff && (
            <GreenButton
              onClick={() => openConfirmationDialog(selectedContest)}
            >
              <Typography align="center" style={{ color: "white" }}>
                Usuń
              </Typography>
            </GreenButton>
          )}
          {/* # REQ_21_END */}
          <GreenButton onClick={handleModalClose}>
            <Typography align="center" style={{ color: "white" }}>
              Zamknij
            </Typography>
          </GreenButton>
          <ConfirmationWindow
            open={openPopUpBeforeDelete}
            setOpen={setOpenPopUpBeforeDelete}
            title="Czy na pewno chcesz usunąć ten konkurs?"
            message="Spowoduje to usunięcie wszystkich powiązanych zgłoszeń i ich ocen wraz z kryteriami. Ta akcja jest nieodwracalna."
            onConfirm={handleDeleteContest}
          />
          <ConfirmationWindow
            open={openPopUpAfterDelete}
            setOpen={setOpenPopUpAfterDelete}
            title={
              reviewDeleteErrorMessage
                ? "Wystąpił błąd przy usuwaniu konkursu"
                : "Pomyślnie usunięto konkurs"
            }
            message={
              reviewDeleteErrorMessage ||
              "Zostaniesz przekierowany do strony głównej"
            }
            onConfirm={handleClosePopUpAfterDelete}
            showCancelButton={false}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContestIndexPage;
