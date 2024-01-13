import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function GradeCriterionCard({ number, gradeCategory, minGrade, maxGrade }) {
  return (
    <div className="lower-grade-entry-card">
      <div className="circle">
        <span className="circle-number">{number}</span>
      </div>
      <p className="lower-grade-entry-card-text" style={{ display: "inline-block", marginLeft: "10px" }}>
        {gradeCategory}
      </p>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="setGradeLabel">Ocena</InputLabel>
        <Select labelId="setGradeLabel" id="setGradeSelect" label="Ocena">
          {Array.from({ length: maxGrade - minGrade + 1 }, (_, index) => (
            <MenuItem key={index} value={minGrade + index}>
              {minGrade + index}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default GradeCriterionCard;
