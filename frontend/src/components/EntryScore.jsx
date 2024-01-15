import { Box, Typography } from "@mui/material";

export default function EntryScore({ badgeColor, score, maxScore = "suma" }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: badgeColor,
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <Typography
          variant="body1"
          component="div"
          style={{ fontWeight: "bold", fontSize: "20px" }}
        >
          {score || "-"}
        </Typography>
      </Box>
      <Typography variant="body2" component="div">
        max. {maxScore}
      </Typography>
    </Box>
  );
}
