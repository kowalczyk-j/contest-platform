import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import Navbar from "./Navbar";
import BackButton from "./buttons/BackButton";
import SchoolIcon from "@mui/icons-material/School";
import ConfirmationWindow from "./ConfirmationWindow";
import { useNavigate } from "react-router-dom";

export default function UsersListPage() {
  const [data, setData] = useState([]);
  const [displayType, setDisplayType] = useState("users");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
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
  // REQ_08A
  const updateUserStatus = (userId, statusType) => {
    axios
      .patch(
        `${import.meta.env.VITE_API_URL}api/users/${userId}/update_status/`,
        { statusType },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        fetchData(); // Refresh data after update
      })
      .catch((error) => console.error("Error updating status: ", error));
  };
  // REQ_08A_END
  const handleOpenMenu = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleMenuItemClick = (statusType) => {
    if (selectedUserId) {
      updateUserStatus(selectedUserId, statusType);
    }
    handleCloseMenu();
  };

  const deleteUser = (userId) => {
    setSelectedUserId(userId);
    setConfirmationTitle("Czy na pewno chcesz usunąć tego użytkownika?");
    setConfirmationMessage(
      "Spowoduje to usunięcie wszystkich powiązanych z nim danych. Pamiętaj, że nie da się usunąć konta administratora."
    );
    setConfirmationOpen(true);
  };

  const confirmDeleteUser = () => {
    axios
      .delete(
        `${
          import.meta.env.VITE_API_URL
        }api/users/${selectedUserId}/delete_account/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        fetchData(); // Refresh data after deletion
      })
      .catch((error) => console.error("Error deleting user: ", error))
      .finally(() => {
        setConfirmationOpen(false);
      });
  };

  const deleteSchool = (schoolId) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}api/schools/${schoolId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        fetchData(); // Refresh data after deletion
      })
      .catch((error) => console.error("Error deleting school: ", error));
  };

  const renderCardItem = (item) => {
    if (displayType === "users") {
      return (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Avatar />
          <Box sx={{ ml: 2, flexGrow: 1 }}>
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

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ minWidth: "80px" }}
              onClick={(event) => handleOpenMenu(event, item.id)}
            >
              Nadaj uprawnienia
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => deleteUser(item.id)}
            >
              Usuń
            </Button>
          </Box>
        </Box>
      );
    } else if (displayType === "schools") {
      return (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Avatar>
              <SchoolIcon />
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" component="div">
                {item.name}
              </Typography>

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
            </Box>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => deleteSchool(item.id)}
          >
            Usuń
          </Button>
        </Box>
      );
    } else {
      return null;
    }
  };

  return (
    <ThemeProvider theme={montserrat}>
      <Navbar />
      <BackButton clickHandler={handleBackClick} />
      <Box sx={{ px: 4, maxWidth: "7xl", mx: "auto" }}>
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Button
            onClick={() => setDisplayType("users")}
            variant={displayType === "users" ? "contained" : "outlined"}
            sx={{ mr: 2 }}
          >
            Użytkownicy
          </Button>
          <Button
            onClick={() => setDisplayType("schools")}
            variant={displayType === "schools" ? "contained" : "outlined"}
            sx={{ ml: 2 }}
          >
            Szkoły
          </Button>
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

        <Menu
          id="user-status-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleMenuItemClick("admin")}>
            Administrator
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("jury")}>Jury</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("coordinating_unit")}>
            Jednostka koordynująca
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("user")}>
            Usuń wszystkie uprawnienia
          </MenuItem>
        </Menu>

        <ConfirmationWindow
          open={confirmationOpen}
          setOpen={setConfirmationOpen}
          title={confirmationTitle}
          message={confirmationMessage}
          onConfirm={confirmDeleteUser}
        />
      </Box>
    </ThemeProvider>
  );
}
