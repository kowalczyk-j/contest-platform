import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, Avatar } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import Navbar from "./Navbar";
import BackButton from "./buttons/BackButton";
import ColorButton from "./buttons/ColorButton";
import SchoolIcon from "@mui/icons-material/School";

export default function UsersListPage() {
  const [data, setData] = useState([]);
  const [displayType, setDisplayType] = useState("users");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  const fetchData = () => {
    const endpoint = displayType === "users" ? "api/users" : "api/schools";

    axios
      .get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  };

  useEffect(() => {
    fetchData();
  }, [displayType]);

  const renderCardItem = (item) => {
    if (displayType === "users") {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" component="div">
              #{item.id} {item.username}
            </Typography>

            <Typography variant="body2" component="div">
              {item.first_name} {item.last_name}
            </Typography>

            <Typography variant="body2" component="div">
              {item.email}
            </Typography>

            <Typography variant="body2" component="div">
              Dołączył: {new Date(item.date_joined).toLocaleDateString()}
            </Typography>

            {item.is_staff && (
              <Typography variant="body2" component="div" sx={{ color: "red" }}>
                Admin
              </Typography>
            )}

            {item.is_jury && (
              <Typography
                variant="body2"
                component="div"
                sx={{ color: "purple" }}
              >
                Jury
              </Typography>
            )}

            {item.is_coordinating_unit && (
              <Typography
                variant="body2"
                component="div"
                sx={{ color: "green" }}
              >
                Jednostka koordynująca
              </Typography>
            )}
          </Box>
        </Box>
      );
    } else if (displayType === "schools") {
      return (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar>
              <SchoolIcon />
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" component="div">
                {item.name}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" component="div">
            {item.street} {item.building_number} {item.apartment_number}
          </Typography>

          <Typography variant="body2" component="div">
            {item.postal_code} {item.city}
          </Typography>

          <Typography variant="body2" component="div">
            Telefon: {item.phone}
          </Typography>

          <Typography variant="body2" component="div">
            E-mail: {item.email}
          </Typography>

          {item.website && (
            <Typography variant="body2" component="div">
              Strona www: <a href={item.website}>{item.website}</a>
            </Typography>
          )}
        </>
      );
    } else {
      return null; // Dla przypadków, gdy displayType jest niepoprawny
    }
  };

  return (
    <ThemeProvider theme={montserrat}>
      <Navbar />
      <BackButton clickHandler={handleBackClick} />
      <Box sx={{ px: 4, maxWidth: "7xl", mx: "auto" }}>
        <Box sx={{ textAlign: "center", my: 2 }}>
          <ColorButton
            className="back"
            onClick={() => setDisplayType("users")}
            sx={{ mr: 2 }}
          >
            Użytkownicy
          </ColorButton>
          <ColorButton
            className="back"
            onClick={() => setDisplayType("schools")}
            sx={{ ml: 2 }}
          >
            Szkoły
          </ColorButton>
        </Box>

        <Box sx={{ textAlign: "center", my: 2, mx: "auto" }}>
          <Typography
            style={{ fontWeight: "bold", marginTop: "20px" }}
            variant="h4"
            component="h1"
          >
            {displayType === "users" ? "Użytkownicy" : "Szkoły"}
          </Typography>
        </Box>

        {data.map((item) => (
          <Card
            key={item.id}
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              maxWidth: "700px",
              mx: "auto",
              boxShadow: "0 0 3px 1px #95C21E",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                flexGrow: 1,
                ml: 2,
              }}
            >
              {renderCardItem(item)}
            </Box>
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
}
