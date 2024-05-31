import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import ConfirmationWindow from "./ConfirmationWindow";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

const Logout = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const [logoutErrorMessage, setLogoutErrorMessage] = useState("");

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      console.log(token);
      const logoutEndpoint = `${import.meta.env.VITE_API_URL}api/logout/`;
      const headers = {
        headers: {
          Authorization: "Token " + token,
        },
      };
      await axios.get(logoutEndpoint, headers);
      updateSession();
    } catch (error) {
      setLogoutError(true);
      setLogoutErrorMessage(JSON.stringify(error.response.data, null, 2));
      setOpenPopup(true);
      console.error("Logout failed:", error);
    }
  };
  const updateSession = async () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userData");
    setOpenPopup(true);
    setLogoutError(false);
  };

  const handleBack = () => {
    setLogoutError(false);
    setOpenPopup(false);
    window.location.href = "/";
  };
  return (
    <>
      <MenuItem key="logout" onClick={handleLogout}>
        <Typography textAlign="center">Wyloguj</Typography>
      </MenuItem>
      <ConfirmationWindow
        open={openPopup}
        setOpen={setOpenPopup}
        title={logoutError ? "Wylogowanie nieudane" : "Pomyślnie wylogowano"}
        message={logoutError ? logoutErrorMessage : null}
        onConfirm={() => (logoutError ? setOpenPopup(false) : handleBack())}
        showCancelButton={false}
      />
    </>
  );
};
export default Logout;
