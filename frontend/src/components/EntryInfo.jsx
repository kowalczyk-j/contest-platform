import { Box, Typography, Button, Modal, IconButton } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationWindow from "./ConfirmationWindow";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function EntryInfo({
  id,
  title,
  name,
  surname,
  date,
  entryFile,
  contestTitle,
  userView,
  onDeleteClick,
  favourite: initialFavourite,
  canceled: initialCanceled,
  handleFavouriteChange
}) {
  const navigate = useNavigate();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isFavourite, setStarred] = useState(initialFavourite);
  const [isCanceled, setCanceled] = useState(initialCanceled);

  const handleDeleteClick = () => {
    onDeleteClick(id);
  };

  const handleRateClick = (entryId) => {
    navigate(`/grade-entry-rate/${entryId}`);
  };

  const handleRateViewClick = (entryId) => {
    navigate(`/grade-entry-view/${entryId}`);
  };
  
  const handleViewWorkClick = () => {
    navigate(`/view-work/${id}`);
  };

  const toggleStarred = (entryId) => {
    if (isCanceled) {
      handleFavouriteChange(true, false, entryId);
      setCanceled(false);
    }
    else {
      handleFavouriteChange(!isFavourite, false, entryId)
    }   
    setStarred(!isFavourite);
  };
  // using handleFavouriteChange(!isFavourite, !isCanceled) doesnt work properly
  const toggleCanceled = (entryId) => {
    if (isFavourite) {
      handleFavouriteChange(false, true, entryId);
      setStarred(false);
    }
    else {
      handleFavouriteChange(false, !isCanceled, entryId)
    }
    setCanceled(!isCanceled)
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
      {userView ? (
        <Typography variant="body1" color="text.secondary">
          <span className="green-bold">Nazwa konkursu: </span> {contestTitle}
        </Typography>
      ) : (
        <Typography variant="body1" color="text.secondary">
          <span className="green-bold">Imię i nazwisko: </span> {name} {surname}
        </Typography>
      )}

      <Box sx={{ mt: 0.5, ml: -1 }}>
        {entryFile ? (
          <Button color="primary" onClick={handleViewWorkClick}>
            Zobacz pracę
          </Button>
        ) : null}

        {userView ? null : (
          <>
            <Button color="success" onClick={() => handleRateClick(id)}>
              Oceń
            </Button>
            <Button color="secondary" onClick={() => handleRateViewClick(id)}>
              Zobacz oceny
            </Button>
            <Button color="error" onClick={() => setOpenPopUp(true)}>
              Usuń
            </Button>
            <IconButton onClick={() => toggleStarred(id)}>
              {isFavourite ? <StarIcon sx={{ color: 'orange' }} /> : <StarBorderIcon sx={{ color: 'orange' }} />}
            </IconButton>
            <IconButton onClick={() => toggleCanceled(id)}>
              {isCanceled ? <CancelIcon sx={{ color: 'red' }} /> : <CancelOutlinedIcon sx={{ color: 'red' }} />}
            </IconButton>
          </>
        )}

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
