import { ThemeProvider } from '@mui/material/styles';
import Piesio_hr from '../static/assets/piesio_hr.jpg';
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/500.css'
// import montserrat from '../static/theme';
import { Typography } from '@mui/material';
import FileUploadButton from './FileUploadButton';

import SubmitButton from './SubmitButton';
import GradeUpperCardInfo from './GradeUpperCardInfo';
import GradeLowerCardInfo from './GradeLowerCardInfo';

function GradeEntryForm() {
  return(
    <>
      <div className="grade-entry-card">
        <div className="upper-grade-entry-card">
          <div className="upper-grade-entry-card-text">
            <h1>
              <Typography fontFamily={"Montserrat"} fontWeight={700} fontSize={36}>O pracy</Typography>
            </h1>
            <GradeUpperCardInfo entryName={"Mój piękny piesek"} authorName={"Jan Pan"} age={21} applicant={"MSCZ Pruszków"}/>
          </div>
          <div className='grade-entry-card-photo'>
            <img src={Piesio_hr} alt="zdjęcie pracy" width={200} size={200}></img>
          </div>
        </div>
        <FileUploadButton name='Pobierz pracę'/>
        <h1>
          <Typography fontFamily={"Montserrat"} fontWeight={700} fontSize={36}>Kryteria oceny</Typography>
        </h1>

        <GradeLowerCardInfo number={1} gradeCategory={"Zgodność z tematem/przedmiotem Konkursu"} minGrade={0} maxGrade={3} />
        <GradeLowerCardInfo number={2} gradeCategory={"Atrakcyjność i bogactwo opisu"} minGrade={0} maxGrade={3} />
        <GradeLowerCardInfo number={3} gradeCategory={"Atrakcyjność zdjęcia"} minGrade={0} maxGrade={3} />

        <SubmitButton className="grade-entry-card-commit-button" text="Zatwierdź ocenę"/>

      </div>
    </>
  );
} // TODO: ogarnąć themeProvidera, dodać przyciski pobierania i zatwierdzania oceny, przetestować z dużym zdjęciem, odstęp z lewej strony dla przycisku, stopień ocen
// !!! TODO: Dodać handleChange do przycisku (zakładka)

export default GradeEntryForm