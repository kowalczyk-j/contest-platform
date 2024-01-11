import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EntryInfo({
  id,
  name,
  surname,
  age,
  school,
  onDeleteClick,
}) {
  const navigate = useNavigate();
  const handleEditClick = (entryId) => {
    navigate("/contest/1");
  };

  const handleDeleteClick = () => {
    onDeleteClick(id);
  };

  const handleRateClick = () => {
    navigate("/login");
  };
  return (
    <Box sx={{ mr: 2 }}>
      <Typography variant="h5" component="h2">
        <span className="green-bold">#{id}</span>
      </Typography>

      {contestants.map((person, index) => (
        <div key={person.id}>
          <Typography variant="body1" color="text.secondary">
            <span className="green-bold">Imię: </span> {person.name}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            <span className="green-bold">Nazwisko: </span> {person.surname}
          </Typography>
        </div>
      ))}

      <Typography variant="body1">
        <span className="green-bold">Wiek: </span>
        {age}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        <span className="green-bold">Jednostka koordynująca: </span> {school}
      </Typography>
      <Box sx={{ mt: 0.5, ml: -1 }}>
        <Button color="success" onClick={() => handleRateClick(id)}>
          Oceń
        </Button>
        <Button color="warning" onClick={() => handleEditClick(id)}>
          Edytuj
        </Button>
        <Button color="error" onClick={handleDeleteClick}>
          Usuń
        </Button>
      </Box>
    </Box>
  );
}
