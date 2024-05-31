import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Grid,
  Link,
} from "@mui/material";
import axios from "axios";
import ConfirmationWindow from "./ConfirmationWindow";
import Header from "./Header";
import BackButton from "./buttons/BackButton";
import ColorButton from "./buttons/ColorButton";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const navigate = useNavigate();

  // REQ_06D
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError(false);
    const postData = {
      username: username,
      password: password,
    };

    const loginLink = `${import.meta.env.VITE_API_URL}api/login/`;
    const headersLogin = { headers: { "Content-Type": "application/json" } };

    try {
      const response = await axios.post(loginLink, postData, headersLogin);
      const responseData = response.data;
      const token = responseData.token;
      sessionStorage.setItem("accessToken", token);

      const currentUserLink = `${
        import.meta.env.VITE_API_URL
      }api/users/current_user/`;

      const headersCurrentUser = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
      };

      const userResponse = await axios.get(currentUserLink, headersCurrentUser);
      setIsStaff(userResponse.data.is_staff);
      sessionStorage.setItem("isStaff", userResponse.data.is_staff);

      setOpenPopup(true);
    } catch (error) {
      console.log("Login failed:", error.message);
      setLoginError(true);
      if (error.response.data.non_field_errors) {
        setLoginErrorMessage(`Podane dane są nieprawidłowe!`);
      } else {
        setLoginErrorMessage(`Błąd logowania: ${error.message}`);
      }
      setOpenPopup(true);
    }
  };
  //REQ_06D_END
  const handleBack = () => {
    setLoginError(false);
    setLoginErrorMessage("");
    setOpenPopup(false);
    navigate("/");
  };

  return (
    <div>
      <Header logoSize="150px" />
      <BackButton clickHandler={handleBack} />
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Card>
            <CardHeader
              title="Logowanie"
              titleTypographyProps={{ align: "center" }}
            />
            <CardContent>
              <form onSubmit={handleLogin}>
                <div>
                  <TextField
                    id="username"
                    label="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <TextField
                    id="password"
                    label="Hasło"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <Typography
                  style={{
                    marginTop: "10px",
                    marginBottom: "15px",
                    textAlign: "center",
                  }}
                >
                  Nie masz konta? <Link href="/register">Zarejestruj się</Link>
                </Typography>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ColorButton variant="contained" type="submit">
                    Zaloguj się
                  </ColorButton>
                </div>
                <ConfirmationWindow
                  open={openPopup}
                  setOpen={setOpenPopup}
                  title={
                    loginError ? "Logowanie nieudane" : "Pomyślnie zalogowano"
                  }
                  message={loginError ? loginErrorMessage : null}
                  onConfirm={() =>
                    loginError ? setOpenPopup(false) : handleBack()
                  }
                  showCancelButton={false}
                />
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginPage;
