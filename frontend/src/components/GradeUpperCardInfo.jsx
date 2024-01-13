import { Typography } from "@mui/material";

function GradeUpperCardInfo({ entryName, authorName, age, applicant }) {
  return(
    <>
      <p>
        <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'} color='#95C21E'>Tytuł pracy: </Typography>
        <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'}>"{entryName}"</Typography>
      </p>
      <p>
        <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'} color='#95C21E'>Autor pracy: </Typography>
        <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'}>{authorName}</Typography>
      </p>
      <p>
        <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'} color='#95C21E'>Wiek: </Typography>
        <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'}>{age}</Typography>
      </p>
      <p>
        <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'} color='#95C21E'>Jednostka koordynująca: </Typography>
        <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'}>{applicant}</Typography>
      </p>
    </>
  );
}

export default GradeUpperCardInfo;