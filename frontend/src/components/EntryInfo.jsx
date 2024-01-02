import { Box, Typography } from "@mui/material";

export default function EntryInfo({ id, name, surname, age, school }) {
  return (
    <Box sx={{ mr: 2 }}>
      <Typography variant="h5" component="h2">
        <span className="green-bold">
          #{id} {name} {surname}
        </span>
      </Typography>
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
