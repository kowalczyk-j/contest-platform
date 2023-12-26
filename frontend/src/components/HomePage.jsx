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
import Logo from "../static/assets/Logo.png";
import axios from "axios";

const GreenButton = styled(Button)({
  backgroundColor: "#95C21E",
  color: "white",
  "&:hover": {
    backgroundColor: "#82a819",
  },
});

const ContestIndexPage = () => {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}contests/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token 2336386141986178201499d767a9f556f04e2b67'
      }
    }
    ).then((ret) => {
      setContests(ret.data)
    }).catch(error => console.error("Error:", error));
  }, []);

  const handleContestClick = (contest) => {
    setSelectedContest(contest);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img style={{ width: "200px" }} src={Logo} alt="Logo" />
      </div>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ marginTop: "20px" }}
      >
        Aktywne konkursy
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item>
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
            <CardHeader title="Dodaj konkurs" />
            <CardContent>
              <Link to={"/create-contest"}>
                <GreenButton>
                  <div className="tile">
                    <Typography align="center" style={{ color: "white" }}>
                      Dodaj konkurs
                    </Typography>
                  </div>
                </GreenButton>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {contests.map((contest) => (
          <Grid item key={contest.id}>
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
              <CardHeader title={contest.title} />
              <CardContent>
                <GreenButton onClick={() => handleContestClick(contest)}>
                  <div className="contest-tile">
                    <Typography align="center" style={{ color: "white" }}>
                      Zobacz więcej
                    </Typography>
                  </div>
                </GreenButton>
              </CardContent>
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
        <DialogTitle>{selectedContest?.title}</DialogTitle>
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
          {/* Add other details as needed */}
        </DialogContent>
        <DialogActions>
          <Link to={`/contest/${selectedContest?.id}`}>
            <GreenButton>
              <Typography align="center" style={{ color: "white" }}>
                Weź udział
              </Typography>
            </GreenButton>
          </Link>
          <GreenButton onClick={handleModalClose}>
            <Typography align="center" style={{ color: "white" }}>
              Zamknij
            </Typography>
          </GreenButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContestIndexPage;
