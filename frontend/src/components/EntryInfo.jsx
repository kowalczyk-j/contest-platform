import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationWindow from "./ConfirmationWindow";

export default function EntryInfo({
  id,
  title,
  name,
  surname,
  date,
  score,
  onDeleteClick,
}) {
  const navigate = useNavigate();
  const [openPopUp, setOpenPopUp] = useState(false);

  const handleDeleteClick = () => {
    onDeleteClick(id);
  };

  const handleRateClick = (entryId) => {
    navigate(`/grade-entry/${entryId}`);
  };
  return (
    <Box sx={{ mr: 2 }}>
      <Typography variant="h5" component="h2">
        <span className="green-bold">
          #{id} {title}
        </span>
      </Typography>
      <Typography variant="body1">
        <span className="green-bold">Zgłoszono: </span>
        {date}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        <span className="green-bold">Imię i nazwisko: </span> {name} {surname}
      </Typography>
      <Box sx={{ mt: 0.5, ml: -1 }}>
        <Button color="success" onClick={() => handleRateClick(id)}>
          Panel oceny
        </Button>
        {/* <Button color="warning" onClick={() => handleEditClick(id)}>
          Edytuj
        </Button> */}
        <Button color="error" onClick={() => setOpenPopUp(true)}>
          Usuń
        </Button>
        <ConfirmationWindow
          open={openPopUp}
          setOpen={setOpenPopUp}
          title="Czy na pewno chcesz usunąć to zgłoszenie?"
          message="Ta akcja jest nieodwracalna"
          onConfirm={handleDeleteClick}
        />
      </Box>
    </Box>
  );
}
