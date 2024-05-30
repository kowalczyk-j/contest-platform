import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Grid,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import UserEntries from "./UserEntries";
import Navbar from "./Navbar";
import BackButton from "./buttons/BackButton";
import ColorButton from "./buttons/ColorButton";
import Logout from "./Logout";
import ConfirmationWindow from "./ConfirmationWindow";

const UserProfilePage = () => {
  const [user, setUser] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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

  const handleEditOpen = () => {
    setFirstName(user.first_name || "");
    setLastName(user.last_name || "");
    setEmail(user.email || "");
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}api/users/update-profile/`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      );
      setUser(response.data);
      setConfirmationTitle("Sukces");
      setConfirmationMessage("Dane użytkownika zostały zaktualizowane.");
      setOpenEditDialog(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      setConfirmationTitle("Wystąpił błąd");
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data)
          .flat()
          .join(" ");
        setConfirmationMessage(errorMessage);
      } else {
        setConfirmationMessage(
          "Nie udało się zaktualizować danych użytkownika."
        );
      }
    } finally {
      setConfirmationOpen(true);
    }
  };

  const handleDeleteOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}api/users/${user.id}/delete_account/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      );
      setConfirmationTitle("Sukces");
      setConfirmationMessage(
        "Pomyślnie usunięto konto. Zostaniesz wylogowany."
      );
      sessionStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Error deleting account:", error);
      setConfirmationTitle("Błąd");
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data)
          .flat()
          .join(" ");
        setConfirmationMessage(errorMessage);
      } else {
        setConfirmationMessage("Wystąpił błąd podczas usuwania konta.");
      }
    } finally {
      // navigate("/");
      setConfirmationOpen(true);
    }
  };

  const handleChangePasswordOpen = () => {
    setOpenChangePasswordDialog(true);
  };

  const handleChangePasswordClose = () => {
    setOpenChangePasswordDialog(false);
  };

  const handleChangePassword = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}api/users/change_password/`,
        {
          old_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + sessionStorage.getItem("accessToken"),
          },
        }
      );
      setOpenChangePasswordDialog(false);
      setConfirmationTitle("Sukces");
      setConfirmationMessage("Hasło zostało zmienione.");
    } catch (error) {
      console.error("Error changing password:", error);
      setConfirmationTitle("Błąd");
      if (error.response && error.response.data) {
        const errorMessage = Object.values(error.response.data)
          .flat()
          .join(" ");
        setConfirmationMessage(errorMessage);
      } else {
        setConfirmationMessage("Wystąpił błąd podczas zmiany hasła.");
      }
    } finally {
      setConfirmationOpen(true);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <ThemeProvider theme={montserrat}>
      <Navbar />
      <BackButton clickHandler={handleBack} />

      <Box sx={{ px: 4, maxWidth: "7xl", mx: "auto" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Profil użytkownika ID #{user.id}
        </Typography>

        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid
            item
            xs={12}
            sm={1}
            md={3}
            sx={{
              display: "flex",
              justifyContent: "center",
              minWidth: 150,
              minHeight: 150,
            }}
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
              <Box mt={-2} mb={1} display="flex" justifyContent="center">
                <Logout />
              </Box>
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
                <Box mt={2} display="flex" justifyContent="space-between">
                  <ColorButton onClick={handleEditOpen}>
                    Edytuj dane
                  </ColorButton>
                  <ColorButton onClick={handleChangePasswordOpen}>
                    Zmień hasło
                  </ColorButton>
                  <ColorButton onClick={handleDeleteOpen}>
                    Usuń konto
                  </ColorButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <UserEntries />
      </Box>

      {/* Dialog do edycji danych */}
      <Dialog open={openEditDialog} onClose={handleEditClose}>
        <DialogTitle>Edytuj dane</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Wprowadź nowe dane do edycji swojego profilu.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Imię"
            type="text"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Nazwisko"
            type="text"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Anuluj</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Zapisz zmiany
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog do zmiany hasła */}
      <Dialog
        open={openChangePasswordDialog}
        onClose={handleChangePasswordClose}
      >
        <DialogTitle>Zmień hasło</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Wprowadź swoje obecne hasło oraz nowe hasło.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Obecne hasło"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Nowe hasło"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangePasswordClose}>Anuluj</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            color="primary"
          >
            Zmień hasło
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog do usuwania konta */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle>Czy na pewno chcesz usunąć konto?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Usunięcie konta spowoduje trwałe usunięcie wszystkich danych
            związanych z Twoim kontem. Operacji tej nie można cofnąć.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Anuluj</Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
          >
            Usuń konto
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationWindow
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        title={confirmationTitle}
        message={confirmationMessage}
        showCancelButton={false}
        onConfirm={() => setConfirmationOpen(false)}
      />
    </ThemeProvider>
  );
};

export default UserProfilePage;
