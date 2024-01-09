import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function GradeLowerCardInfo({ number, gradeCategory, minGrade, maxGrade }) {
  return(
    <>
      <div className="lower-grade-entry-card">
          <div className="grade-entry-card-num-circle">
            <text style={{ margin: "auto", fontFamily: "Montserrat", fontSize: 26, fontWeight: "bold" }}>{number}</text>
          </div>
          <p className="lower-grade-entry-card-text">
            {gradeCategory}
          </p>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="setGradeLabel">
              Ocena
            </InputLabel>
            <Select labelId="setGradeLabel" id="setGradeSelect" label="Ocena">
              {(() => {
                for (let index = minGrade; index < (maxGrade+1); index++) {
                  <MenuItem value={index}>{index}</MenuItem>
                }
              })()}
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
        </div>
    </>
  );
}

export default GradeLowerCardInfo;