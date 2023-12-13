import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Typography, TextField, Button, FormControl, FormControlLabel, Radio, RadioGroup, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import FileUploadButton from './FileUploadButton';
import Logo from '../static/assets/Logo.png';

const ColorButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  lineHeight: 1.5,
  backgroundColor: '#95C21E',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: '#82a819',
    borderColor: "none",
    boxShadow: 'none',
  },
});

function CreateContestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [individual, setIndividual] = useState('');
  const [type, setType] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}contests/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          description: description,
          date_start: dateStart,
          date_end: dateEnd,
          individual: individual,
          type: type
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBack = () => {navigate("/");};


  return (
  <div>
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <img style={{width: "200px"}} src={Logo} alt="Logo" />
    </div>
    
    <Button onClick={handleBack} style={{display: "flex", flexDirection: "row", marginInline: "22%", alignItems: "baseline"}}>Powrót</Button>
      <Grid container justifyContent="center" alignItems="center">
        
        <Grid item>
          <Card>
            <CardHeader title="Utwórz konkurs" subheader="Wypełnij wszystkie poniższe pola." />
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <FormControl style={{display: "flex", margin: "2%"}} className="flex flex-col space-y-4">
                    <TextField id="title" label="Tytuł konkursu" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </FormControl>
                </div>
                <div>
                  <FormControl style={{display: "flex", margin: "2%"}} className="flex flex-col space-y-2">
                    <TextField
                      id="description"
                      label="Opis"
                      multiline
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormControl>
                </div>
                <div style={{display: "flex", justifyContent: "flex-start", margin: "2%"}}>
                  <FormControl className="flex flex-col space-y-2">
                    <TextField id="date" style={{width: "120%"}} label="Data rozpoczęcia" type="date" InputLabelProps={{ shrink: true }} value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)} />
                  </FormControl>
                  <FormControl className="flex flex-col space-y-2">
                    <TextField id="date" style={{marginLeft: "50%", width: "120%"}} label="Data zakończenia" type="date" InputLabelProps={{ shrink: true }} value={dateEnd} onChange={(e) => setDateEnd(e.target.value)}/>
                  </FormControl>
                </div>
                <div style={{margin: "2%"}}>
                  <FormControl component="fieldset" className="flex flex-col space-y-2">
                    <Typography component="legend">Typ konkursu:</Typography>
                    <RadioGroup row aria-label="type" 
                                name="row-radio-buttons-group" 
                                value={individual}
                                onChange={(e) => setIndividual(e.target.value)}>
                      <FormControlLabel value="1" control={<Radio />} label="indywidualny" />
                      <FormControlLabel value="0" control={<Radio />} label="grupowy" />
                    </RadioGroup>
                  </FormControl>
                </div>

                <div style={{margin: "2%"}}>
                  <FormControl component="fieldset" className="flex flex-col space-y-2">
                    <Typography component="legend">Typ zgłoszeń:</Typography>
                    <RadioGroup row aria-label="type"
                                name="row-radio-buttons-group"
                                value={type}
                                onChange={(e) => setType(e.target.value)}>
                      <FormControlLabel value="plastyczne" control={<Radio />} label="plastyczne" />
                      <FormControlLabel value="literackie" control={<Radio />} label="literackie" />
                      <FormControlLabel value="inne" control={<Radio />} label="inne: " />
                      <TextField id="other" style={{width: "33%"}} />

                    </RadioGroup>
                  </FormControl>
                </div>
                <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "2%", marginBottom: "2%"}}>
                  <FileUploadButton name="Załącz regulamin" />
                  <FileUploadButton name="Załącz plakat" />
                </div>
                <div style={{display: "flex", justifyContent: "space-evenly"}}>
                  <ColorButton variant="contained" style={{width: "225px"}} type="submit">Utwórz konkurs</ColorButton>
                </div>
              </form>
            </CardContent>
        </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default CreateContestPage;