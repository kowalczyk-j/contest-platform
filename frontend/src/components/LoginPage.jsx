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
  Radio,
  RadioGroup,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ConfirmationWindow from "./ConfirmationWindow";
import axios from "axios";
import Header from "./Header";
import BackButton from "./buttons/BackButton";

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

    axios
      .post(loginLink, postData, headersLogin)
      .then((response) => {
        const responseData = response.data;
        const token = responseData.token;
        sessionStorage.setItem("accessToken", token);

        const currentUserLink = `${import.meta.env.VITE_API_URL
          }api/users/current_user/`;

        const headersCurrentUser = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
        };
        axios
          .get(currentUserLink, headersCurrentUser)
          .then((res) => {
            console.log(res.data);
            setIsStaff(res.data.is_staff);
            sessionStorage.setItem("isStaff", isStaff);
          })
          .catch((error) => {
            console.log("Error:", error);
          });
        setOpenPopup(true);
      })
      .catch((error) => {
        console.log("Login failed:", error.message);
        setLoginError(true);
        setLoginErrorMessage(JSON.stringify(error.response.data, null, 2));
        setOpenPopup(true);
      });
  };
  // REQ_06D_END

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
            <CardHeader title="Logowanie" />
            <CardContent>
              <form onSubmit={handleLogin}>
                <div>
                  <FormControl
                    style={{ display: "flex", margin: "2%" }}
                    className="flex flex-col space-y-4"
                  >
                    <TextField
                      id="username"
                      label="Nazwa użytkownika"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormControl>
                </div>
                <div>
                  <FormControl
                    style={{ display: "flex", margin: "2%" }}
                    className="flex flex-col space-y-4"
                  >
                    <TextField
                      id="password"
                      label="Hasło"
                      value={password}
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </div>
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
                    Zaloguj się
                  </Button>
                  <ConfirmationWindow
                    open={openPopup}
                    setOpen={setOpenPopup}
                    title={
                      loginError ? "Logowanie nieudane" : "Pomyślnie zalogwano"
                    }
                    message={loginError ? loginErrorMessage : null}
                    onConfirm={() =>
                      loginError ? setOpenPopup(false) : handleBack()
                    }
                    showCancelButton={false}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginPage;
