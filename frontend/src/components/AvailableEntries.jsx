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
import { Navigate } from "react-router-dom";
import FileUploadButton from "./FileUploadButton"; /* TODO: stwórz FileDownload zamiast FileUpload */
import MineCard from "./MineCard";

const GreenButton = styled(Button)({
  backgroundColor: "#95C21E",
  color: "white",
  "&:hover": {
    backgroundColor: "#82a819",
  },
});

const AvailableEntries = () => {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}contests`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setContests(result);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchContests();
  }, []);

  const handleBack = () => { Navigate("/"); };

  return (
    <div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img style={{ width: "200px" }} src={Logo} alt="Logo" />
      </div>

      <Button onClick={handleBack} style={{ display: "flex", flexDirection: "row", marginInline: "47%", alignItems: "baseline" }}>Powrót</Button>

      <Grid container justifyContent="center" alignItems="center">
        <MineCard />
      </Grid>
      <>
      </>

    </div>
  );
};

export default AvailableEntries;
