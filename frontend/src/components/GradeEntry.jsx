import React, { useState, useEffect } from "react";
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
  Box,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Logo from "../static/assets/Logo.png";
import { useNavigate } from "react-router-dom";
import FileUploadButton from "./FileUploadButton"; /* TODO: stwórz FileDownload zamiast FileUpload */
import GradeEntryForm from "./GradeEntryForm";
import BackButton from './BackButton';
import { ThemeProvider } from '@mui/material/styles';
import montserrat from "../static/theme";

const GreenButton = styled(Button)({
  backgroundColor: "#95C21E",
  color: "white",
  "&:hover": {
    backgroundColor: "#82a819",
  },
});

const GradeEntry = () => {
  const navigate = useNavigate();

  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleBack = () => { navigate("/entries/:contestId"); };

  return (
    <ThemeProvider theme={montserrat}>
      <div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <img style={{ width: "200px" }} src={Logo} alt="Logo" />
        </div>

        <div className="back-btn">
          <BackButton clickHandler={handleBack} />
        </div>

        <Grid container justifyContent="center" alignItems="center">
          <GradeEntryForm />
        </Grid>

      </div>
    </ThemeProvider>
  );
};

export default GradeEntry;
