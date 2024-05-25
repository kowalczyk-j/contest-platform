import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
  Link,
} from "@mui/material";
import axios from "axios";
import BackButton from "./buttons/BackButton";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import Header from "./Header";
import ConfirmationWindow from "./ConfirmationWindow";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    firstName: "",
    lastName: "",
    isCoordinatingUnit: false,
    isSubscribedToNewsletter: false,
  });
  const [registrationError, setRegistrationError] = useState(false);
  const [registrationErrorMessage, setRegistrationErrorMessage] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegistration = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.passwordConfirmation) {
      setRegistrationError(true);
      setConfirmationMessage("Hasła nie są takie same.");
      setConfirmationOpen(true);
      return;
    }

    const postData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      is_coordinating_unit: formData.isCoordinatingUnit,
      is_newsletter_subscribed: formData.isSubscribedToNewsletter,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/users/`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRegistrationError(false);
      setConfirmationMessage("Pomyślnie zarejestrowano!");
    } catch (error) {
      setRegistrationError(true);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.username) {
          setConfirmationMessage(`Taki użytkownik już istnieje!`);
        } else if (errorData.email) {
          setConfirmationMessage(`Wprowadź poprawny adres e-mail!`);
        } else {
          setConfirmationMessage("Rejestracja nieudana, spróbuj ponownie.");
        }
        setRegistrationErrorMessage(JSON.stringify(errorData, null, 2));
      } else {
        setConfirmationMessage("Wystąpił nieznany błąd, spróbuj ponownie.");
        setRegistrationErrorMessage(error.message);
      }
    }
    setConfirmationOpen(true);
  };

  const handleBack = () => {
    setRegistrationError(false);
    setRegistrationErrorMessage("");
    navigate("/");
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    if (!registrationError) {
      navigate("/");
    }
  };

  return (
    <ThemeProvider theme={montserrat}>
      <div>
        <Header logoSize="150px" />
        <BackButton clickHandler={handleBack} />
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <Card>
              <CardHeader title="Witaj, wypełnij formularz i zarejestruj się!" />
              <CardContent>
                <form onSubmit={handleRegistration}>
                  {[
                    "username",
                    "email",
                    "password",
                    "passwordConfirmation",
                    "firstName",
                    "lastName",
                  ].map((field) => (
                    <FormControl
                      key={field}
                      style={{ display: "flex", margin: "2%" }}
                    >
                      <TextField
                        id={field}
                        label={
                          field === "username"
                            ? "Nazwa użytkownika"
                            : field === "password"
                              ? "Hasło"
                              : field === "passwordConfirmation"
                                ? "Potwierdź hasło"
                                : field === "firstName"
                                  ? "Imię"
                                  : field === "lastName"
                                    ? "Nazwisko"
                                    : field.charAt(0).toUpperCase() +
                                      field.slice(1)
                        }
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        type={field.includes("password") ? "password" : "text"}
                      />
                    </FormControl>
                  ))}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isCoordinatingUnit}
                        onChange={handleInputChange}
                        name="isCoordinatingUnit"
                      />
                    }
                    style={{ margin: "15px" }}
                    label={
                      <Typography
                        style={{ maxWidth: "300px", fontWeight: "lighter" }}
                      >
                        Zarejestruj mnie jako jednostkę koordynującą
                        (przedstawiciel szkoły).
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isSubscribedToNewsletter}
                        onChange={handleInputChange}
                        name="isSubscribedToNewsletter"
                      />
                    }
                    style={{ margin: "15px" }}
                    label={
                      <Typography
                        style={{ maxWidth: "300px", fontWeight: "lighter" }}
                      >
                        Chcę otrzymywać e-maile z informacjami o nadchodzących
                        konkursach.
                      </Typography>
                    }
                  />
                  <Typography
                    style={{
                      marginBottom: "10px",
                      textAlign: "center",
                    }}
                  >
                    Posiadasz już konto? <Link href="/login">Zaloguj się</Link>
                  </Typography>
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#95C21E",
                        color: "white",
                        width: "225px",
                      }}
                      type="submit"
                    >
                      Zarejestruj się
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <ConfirmationWindow
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        title={registrationError ? "Wystąpił błąd" : "Pomyślnie zarejestrowano"}
        message={confirmationMessage}
        onConfirm={handleConfirmationClose}
        showCancelButton={false}
      />
    </ThemeProvider>
  );
};

export default RegistrationPage;
