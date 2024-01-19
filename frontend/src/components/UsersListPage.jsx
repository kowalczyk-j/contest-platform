import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, Avatar } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import Navbar from "./Navbar";
import BackButton from "./BackButton";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate("/");
  };
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  return (
    <ThemeProvider theme={montserrat}>
      <Navbar />
      <BackButton clickHandler={handleBackClick} />
      <Box
        sx={{
          px: 4,
          maxWidth: "7xl",
          mx: "auto",
        }}
      >
        <Box sx={{ textAlign: "center", my: 2, mx: "auto" }}>
          <Typography
            style={{ fontWeight: "bold", marginTop: "20px" }}
            variant="h4"
            component="h1"
          >
            Użytkownicy
          </Typography>
        </Box>
        {users.map((user) => (
          <Card
            key={user.id}
            sx={{
              p: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              maxWidth: "700px",
              mx: "auto",
              boxShadow: "0 0 3px 1px #95C21E",
            }}
          >
            <Avatar />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                flexGrow: 1,
                ml: 2,
              }}
            >
              <Typography variant="h6" component="div">
                #{user.id} {user.username}
              </Typography>
              <Typography variant="body2" component="div">
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body2" component="div">
                {user.email}
              </Typography>
              <Typography variant="body2" component="div">
                Dołączył: {new Date(user.date_joined).toLocaleDateString()}
              </Typography>
              {user.is_staff && (
                <Typography
                  variant="body2"
                  component="div"
                  sx={{ color: "red" }}
                >
                  Admin
                </Typography>
              )}
              {user.is_jury && (
                <Typography
                  variant="body2"
                  component="div"
                  sx={{ color: "purple" }}
                >
                  Jury
                </Typography>
              )}
            </Box>
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
}
