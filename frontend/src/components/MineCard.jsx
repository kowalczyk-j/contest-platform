import { ThemeProvider } from '@mui/material/styles';
import Piesio_hr from '../static/assets/piesio_hr.jpg';
import Piesio_sr from '../static/assets/Piesio_sr.png';
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/500.css'
// import montserrat from '../static/theme';
import { Typography } from '@mui/material';
import FileUploadButton from './FileUploadButton';

function MineCard() {
  return(
    <>
      <div className="card">
        <div className="upperCard">
          <div className="cardText">
            <h1>
              <Typography fontFamily={"Montserrat"} fontWeight={700} fontSize={36}>O pracy</Typography>
            </h1>
            <p>
              <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'} color='#95C21E'>Tytuł pracy:</Typography>
              <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'}> "Mój piękny piesek"</Typography>
            </p>
            <p>
              <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'} color='#95C21E'>Autor pracy:</Typography>
              <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'}> Jan Pan</Typography>
            </p>
            <p>
              <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'} color='#95C21E'>Wiek:</Typography>
              <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'}> 21</Typography>
            </p>
            <p>
              <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'} color='#95C21E'>Jednostka koordynująca:</Typography>
              <Typography fontFamily={"Montserrat"} fontWeight={500} fontSize={18} display={'inline'}> MSCZ Pruszków</Typography>
            </p>
          </div>
          <div className='cardPhoto'>
            <img src={Piesio_hr} alt="zdjęcie pracy" width={200} size={200}></img>
          </div>
        </div>
        <FileUploadButton name='Pobierz pracę'></FileUploadButton>
        <div className="cardTextUnder">
          <h1>
            <Typography fontFamily={"Montserrat"} fontWeight={700} fontSize={36}>Kryteria oceny</Typography>
          </h1>
        </div>
      </div>
    </>
  );
} // TODO: ogarnąć themeProvidera, dodać przyciski pobierania i zatwierdzania oceny, przetestować z dużym zdjęciem, odstęp z lewej strony dla przycisku

export default MineCard