import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";
import { styled } from "@mui/material/styles";

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    p: 4,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 0 3px 1px #95C21E",
  },
});

const ConfirmationWindow = ({ open, setOpen, title, message, onConfirm }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <ThemeProvider theme={montserrat}>
      <StyledDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Anuluj
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="success"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </StyledDialog>
    </ThemeProvider>
  );
};

export default ConfirmationWindow;
