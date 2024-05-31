import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

function GradeCriterionCard({
  positionNumber,
  grade,
  gradeCriterion,
  onGradeChange,
  onCommentChange,
  viewConfirmation,
}) {
  const [selectedValue, setSelectedValue] = useState(grade.value);
  const [textValue, setTextValue] = useState(grade.description);

  const handleChange = (event) => {
    if (viewConfirmation) {
      const value = event.target.value;
      setSelectedValue(value);
      onGradeChange(value); // Notify the parent component about the grade change
    }
  };

  const handleTextChange = (event) => {
    if (viewConfirmation) {
      const text = event.target.value;
      setTextValue(text);
      onCommentChange(text);
    }
  };

  return (
    <div>
      <div className="lower-grade-entry-card">
        <div className="circle">
          <span className="circle-number">{positionNumber}</span>
        </div>
        <p
          className="lower-grade-entry-card-text"
          style={{ display: "inline-block", marginLeft: "10px" }}
        >
          {gradeCriterion.description}
        </p>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="setGradeLabel">Ocena</InputLabel>
          <Select
            labelId="setGradeLabel"
            id="setGradeSelect"
            label="Ocena"
            value={selectedValue}
            onChange={handleChange}
          >
            <MenuItem value={null}>-</MenuItem>
            {Array.from(
              { length: gradeCriterion.max_rating + 1 },
              (_, index) => (
                <MenuItem key={index} value={index}>
                  {index}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </div>
      <div className="lower-grade-entry-comments">
        <TextField
          id="additional-comments"
          label="Dodatkowe komentarze"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={textValue}
          onChange={handleTextChange}
          sx={{ mt: 2 }}
        />
      </div>
    </div>
  );
}

export default GradeCriterionCard;
