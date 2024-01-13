import { ThemeProvider } from '@mui/material/styles';
import Piesio_hr from '../static/assets/piesio_hr.jpg';
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/500.css'
// import montserrat from '../static/theme';
import { Typography } from '@mui/material';
import FileUploadButton from './FileUploadButton';

import SubmitButton from './SubmitButton';
import GradeUpperCardInfo from './GradeUpperCardInfo';
import GradeCriterionCard from './GradeCriterionCard';
import montserrat from "../static/theme";

function GradeEntryForm() {
  return (
    <>
      <div className="grade-entry-card">
        <div className="upper-grade-entry-card">
          <div className="upper-grade-entry-card-text">
            <Typography variant="h3">O pracy</Typography>
            <GradeUpperCardInfo entryName={"Mój piękny piesek"} authorName={"Jan Pan"} age={21} applicant={"MSCZ Pruszków"} />
          </div>
          <div className='grade-entry-card-photo'>
            <img src={Piesio_hr} alt="zdjęcie pracy" width={200} size={200}></img>
          </div>
        </div>
        <FileUploadButton name='Pobierz pracę' />
        <div>
          <Typography variant="h3">Kryteria oceny</Typography>
        </div>

        <GradeCriterionCard number={1} gradeCategory={"Zgodność z tematem/przedmiotem Konkursu"} minGrade={0} maxGrade={3} />
        <GradeCriterionCard number={2} gradeCategory={"Atrakcyjność i bogactwo opisu"} minGrade={0} maxGrade={3} />
        <GradeCriterionCard number={3} gradeCategory={"Atrakcyjność zdjęcia"} minGrade={0} maxGrade={3} />

        <SubmitButton className="grade-entry-card-commit-button" text="Zatwierdź ocenę" />

      </div>
    </ >
  );
} // TODO: dodać przyciski pobierania i zatwierdzania oceny, przetestować z dużym zdjęciem, odstęp z lewej strony dla przycisku, stopień ocen
// !!! TODO: Dodać handleChange do przycisku (zakładka)

export default GradeEntryForm