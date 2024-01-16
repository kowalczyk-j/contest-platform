import PropTypes from "prop-types";

import DoneIcon from "@mui/icons-material/Done";
import ColorButton from "./ColorButton";

function SubmitButton({ text, onClick }) {
  return (
    <ColorButton
      className="done"
      style={{ width: "225px" }}
      variant="contained"
      type="submit"
      onClick={onClick}
      endIcon={<DoneIcon />}
    >
      {text}
    </ColorButton>
  );
}

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SubmitButton;
