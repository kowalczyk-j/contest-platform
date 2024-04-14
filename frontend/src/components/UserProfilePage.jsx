import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Grid,
  Button,
  CardContent,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import UserEntries from "./UserEntries";
import Navbar from "./Navbar";
import BackButton from "./buttons/BackButton";

const UserProfilePage = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}api/users/current_user/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + sessionStorage.getItem("accessToken"),
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <ThemeProvider theme={montserrat}>
      <Navbar />
      <BackButton clickHandler={handleBack} />

      <Box sx={{ px: 4, maxWidth: "7xl", mx: "auto", mt: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Profil użytkownika ID #{user.id}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid
            item
            xs={12}
            sm={1}
            md={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                width: 200,
                border: "1px solid #95C21E",
                borderRadius: 4,
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mt: 2,
                  bgcolor: "#95C21E",
                  borderRadius: "50%",
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  sx={{ fontSize: "48px", lineHeight: "48px", mt: 2 }}
                >
                  {user.username && user.username.charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
              <CardContent>
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  sx={{ overflowWrap: "break-word" }}
                >
                  {user.username}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={8} md={7}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informacje o użytkowniku
                </Typography>
                {user.is_staff && (
                  <Typography variant="body1" color="red" mb={1}>
                    Twoje konto posiada status administratora, dzięki czemu masz
                    dostęp do wszystkich możliwych funkcji.
                  </Typography>
                )}
                {user.is_jury && (
                  <Typography variant="body1" color="purple" mb={1}>
                    Twoje konto posiada status jurora, dzięki czemu masz dostęp
                    do przeglądania i oceniania prac konkursowych.
                  </Typography>
                )}
                {user.is_coordinating_unit && (
                  <Typography variant="body1" color="green" mb={1}>
                    Twoje konto posiada status jednostki koordynującej, dzięki
                    czemu możesz zgłaszać wiele prac do jednego konkursu w
                    imieniu Twoich podopiecznych.
                  </Typography>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      Imię: {user.first_name || "Nie podano imienia"}
                    </Typography>
                    <Typography variant="body1">
                      Nazwisko: {user.last_name || "Nie podano nazwiska"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      Dołączył:{" "}
                      {new Date(user.date_joined).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">
                      Email: {user.email || "Nie podano adresu e-mail"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <UserEntries />
      </Box>
    </ThemeProvider>
  );
};

export default UserProfilePage;
