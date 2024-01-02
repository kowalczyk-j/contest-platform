import { ThemeProvider } from '@mui/material/styles';
import Piesio_hr from '../static/assets/piesio_hr.jpg';
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/500.css'
// import montserrat from '../static/theme';
import { Typography } from '@mui/material';
import FileUploadButton from './FileUploadButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function MineCard() {
  return(
    <>
      <div className="card">
        <div className="upperCard">
          <div className="cardUpperText">
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
        <h1>
          <Typography fontFamily={"Montserrat"} fontWeight={700} fontSize={36}>Kryteria oceny</Typography>
        </h1>
        <div className="cardTextUnder">
          <div className="cardNumberedCircle">
            <text style={{ margin: "auto", fontFamily: "Montserrat", fontSize: 26, fontWeight: "bold" }}>1</text>
          </div>
          <p className="cardTextUnder1">
            Zgodność z tematem/przedmiotem Konkursu
          </p>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="setGradeLabel">
              Ocena
            </InputLabel>
            <Select labelId="setGradeLabel" id="setGradeSelect" label="Ocena">
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="cardTextUnder">
          <div className="cardNumberedCircle">
            <text style={{ margin: "auto", fontFamily: "Montserrat", fontSize: 26, fontWeight: "bold" }}>2</text>
          </div>
          <p className="cardTextUnder1">
            Atrakcyjność i bogactwo opisu
          </p>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="setGradeLabel">
              Ocena
            </InputLabel>
            <Select labelId="setGradeLabel" id="setGradeSelect" label="Ocena">
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="cardTextUnder">
          <div className="cardNumberedCircle">
            <text style={{ margin: "auto", fontFamily: "Montserrat", fontSize: 26, fontWeight: "bold" }}>3</text>
          </div>
          <p className="cardTextUnder1">
            Atrakcyjność zdjęcia
          </p>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="setGradeLabel">
              Ocena
            </InputLabel>
            <Select labelId="setGradeLabel" id="setGradeSelect" label="Ocena">
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
        </div>

        <FileUploadButton className="cardButton" name="Zatwierdź ocenę"/>

      </div>
    </>
  );
} // TODO: ogarnąć themeProvidera, dodać przyciski pobierania i zatwierdzania oceny, przetestować z dużym zdjęciem, odstęp z lewej strony dla przycisku, stopień ocen
// !!! TODO: Dodać handleChange do przycisku (zakładka)

export default MineCard