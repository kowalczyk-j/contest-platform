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
        <Grid item>

          <Card sx={{ width: 800, display: "flex", justifyContent: "space-between" }} style={{border: "1px solid #95C21E"}}>
            <CardContent>

              <FormControl className="flex flex-col space-y-2">
                <div s={{ display: "flex", justifyContent: "right", verticalAlign: "top", alignItems: "right" }}>
                  <img style={{ width: "200px", float: "right" }} src={Logo} alt="Logo" />
                </div>

                <Typography component='div' sx={{ fontSize: 35 }} color="#000000" align="left" gutterBottom>
                  <Box fontWeight='fontWeightBold' display='inline' /*TODO: fontFamily='Montserrat' */>
                    O pracy
                  </Box>
                </Typography>
              </FormControl>

              {/* TODO: Inny sposób na new space aniżeli tworzenie nowych Typography? */}
              <Typography component='div' sx={{ fontSize: 15 }} display="flex" gutterBottom>
                {/* TODO: zmienić imiona osób/nazwy prac itp. */}
                <Box fontWeight='fontWeightBold' color="#95c221">Tytuł pracy:</Box>&nbsp;"Mój piesek"
              </Typography>

              <Typography component='div' sx={{ fontSize: 15 }} display="flex" gutterBottom>
                <Box fontWeight='fontWeightBold' color="#95c221">Autor pracy:</Box>&nbsp;Adam Janek
              </Typography>

              <Typography component='div' sx={{ fontSize: 15 }} display="flex" gutterBottom>
                <Box fontWeight='fontWeightBold' color="#95c221">Wiek:</Box>&nbsp;21
              </Typography>

              <Typography component='div' sx={{ fontSize: 15 }} display="flex" gutterBottom>
                <Box fontWeight='fontWeightBold' color="#95c221">Jednostka koordynująca:</Box>&nbsp;MSCZ Pruszków
              </Typography>

              <div style={{ display: "flex", justifyContent: "left", marginTop: "1%", marginBottom: "1%" }}>
                <FileUploadButton name="Pobierz pracę" />
              </div>

            </CardContent>
          </Card>

        </Grid>
      </Grid>
      <>
      </>

    </div>
  );
};

export default AvailableEntries;
