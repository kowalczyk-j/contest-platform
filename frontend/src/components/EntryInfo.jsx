import { Box, Typography } from "@mui/material";

export default function EntryInfo({ id, contestants, age, school }) {
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
    </Box>
  );
}
