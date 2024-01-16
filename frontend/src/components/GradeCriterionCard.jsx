import { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function GradeCriterionCard({ positionNumber, grade, gradeCriterion, onGradeChange }) {
  const [selectedValue, setSelectedValue] = useState(grade.value);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    onGradeChange(value); // Notify the parent component about the grade change
  };

  return (
    <div className="lower-grade-entry-card">
      <div className="circle">
        <span className="circle-number">{positionNumber}</span>
      </div>
      <p className="lower-grade-entry-card-text" style={{ display: "inline-block", marginLeft: "10px" }}>
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
          {Array.from({ length: gradeCriterion.max_rating + 1 }, (_, index) => (
            <MenuItem key={index} value={index}>
              {index}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default GradeCriterionCard;
