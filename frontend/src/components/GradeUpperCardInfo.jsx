import { Typography } from "@mui/material";

function GradeUpperCardInfo({ entryName, authorName, age, applicant }) {
  return (
    <>
      <div>
        <Typography variant="body1"><span className="green-bold">
          Tytuł pracy:
        </span> {entryName}</Typography>
      </div>
      <div>
        <Typography variant="body1"><span className="green-bold">
          Autor Pracy:
        </span> {authorName}</Typography>
      </div>
      <div>
        <Typography variant="body1"><span className="green-bold">
          Wiek:
        </span> {age}</Typography>
      </div>
      <div>
        <Typography variant="body1"><span className="green-bold">
          Jednostka koordynująca:
        </span> {applicant}</Typography>
      </div>
    </>
  );
}

export default GradeUpperCardInfo;