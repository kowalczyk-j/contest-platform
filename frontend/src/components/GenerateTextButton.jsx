import React from "react";
import CreateIcon from "@mui/icons-material/Create";
import ColorButton from "./ColorButton";

function GenerateTextButton({ text, onClick }) {
  return (
    <ColorButton
      className="done"
      style={{ width: "225px" }}
      variant="contained"
      onClick={onClick}
      endIcon={<CreateIcon />}
    >
      {text}
    </ColorButton>
  );
}

export default GenerateTextButton;
