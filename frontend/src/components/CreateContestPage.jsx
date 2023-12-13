import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, TextField, Button, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import FileUploadButton from './FileUploadButton';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'
import { useNavigate } from 'react-router-dom';


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


  return (
    <Card style={{width: "1000px", marginLeft: "5%"}}>
      <CardHeader title="Utwórz konkurs" subheader="Wypełnij wszystkie poniższe pola." />
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <FormControl className="flex flex-col space-y-4">
              <TextField id="title" style={{width: "950px"}} label="Tytuł konkursu" value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
          </div>
          <div>
            <FormControl className="flex flex-col space-y-2">
              <TextField
                id="description"
                style={{width: "950px"}}
                label="Opis"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </div>
          <div>
            <FormControl className="flex flex-col space-y-2">
              <TextField id="date" label="Data rozpoczęcia" type="date" InputLabelProps={{ shrink: true }} value={dateStart}
              onChange={(e) => setDateStart(e.target.value)} />
            </FormControl>
            <FormControl className="flex flex-col space-y-2">
              <TextField id="date" style={{marginLeft: "15px"}} label="Data zakończenia" type="date" InputLabelProps={{ shrink: true }} value={dateEnd} onChange={(e) => setDateEnd(e.target.value)}/>
            </FormControl>
          </div>
          <div>
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

          <div>
            <FormControl component="fieldset" className="flex flex-col space-y-2">
              <Typography component="legend">Typ zgłoszeń:</Typography>
              <RadioGroup row aria-label="type"
                          name="row-radio-buttons-group"
                          value={type}
                          onChange={(e) => setType(e.target.value)}>
                <FormControlLabel value="plastyczne" control={<Radio />} label="plastyczne" />
                <FormControlLabel value="literackie" control={<Radio />} label="literackie" />
                <FormControlLabel value="inne" control={<Radio />} label="inne: " />
                <TextField id="other" />

              </RadioGroup>
            </FormControl>
          </div>
          <div>
            <FileUploadButton name="Załącz regulamin" />
            <FileUploadButton name="Załącz plakat" />
          </div>

          <div>
            <Popup trigger=
              {<Button variant="outlined" type="submit">Utwórz konkurs</Button>}
              modal nested>
                {
                  close => (
                    <div className='modal'>
                      <div className='content'>
                        Pomyślnie utworzono konkurs!
                      </div>
                      <div>
                        <button onClick={() => navigate('/')}>OK</button>
                      </div>
                    </div>
                  )
                }
              </Popup>
          </div>

        </form>
      </CardContent>
    </Card>
  )
}

export default CreateContestPage;