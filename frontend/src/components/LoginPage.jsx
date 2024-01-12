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
import Logo from "../static/assets/Logo.png";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ConfirmationWindow from "./ConfirmationWindow";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

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

        const currentUserLink = `${
          import.meta.env.VITE_API_URL
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
            const responseData = res.data;
            sessionStorage.setItem("userData", JSON.stringify(responseData));
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      })
      .catch((error) => {
        console.log("Login failed:", error.message);
      });
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img style={{ width: "200px" }} src={Logo} alt="Logo" />
      </div>
      <Button
        style={{
          display: "flex",
          flexDirection: "row",
          marginInline: "22%",
          alignItems: "baseline",
        }}
        onClick={() => handleBack()}
      >
        Powrót
      </Button>
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
                    onClick={() => setOpenSuccess(true)}
                  >
                    Zaloguj się
                  </Button>
                  <ConfirmationWindow
                    open={openSuccess}
                    setOpen={setOpenSuccess}
                    title="Czy na pewno chcesz usunąć to zgłoszenie?"
                    message="Ta akcja jest nieodwracalna"
                    onConfirm={console.log("OK clicked")}
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
