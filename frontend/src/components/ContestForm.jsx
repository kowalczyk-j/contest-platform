import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, FormControlLabel, Radio, RadioGroup, Typography, Button } from '@mui/material';
import FileUploadButton from './FileUploadButton';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import SubmitButton from './SubmitButton';
  

function ContestForm({onSubmit}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [individual, setIndividual] = useState('');
    const [type, setType] = useState('');
    const [otherType, setOtherType] = useState('');

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        navigate("/");
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        let finalType = type;
        if (type === "inne") {
            finalType = otherType;
            console.log("yes");
        }
        onSubmit({ title, description, date_start: dateStart, date_end: dateEnd, individual, type: finalType });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="title">
                <FormControl className="flex flex-col space-y-4" fullWidth={true}>
                    <TextField id="title" label="Tytuł konkursu" value={title} onChange={(e) => setTitle(e.target.value)} />
                </FormControl>
            </div>

            <div className="description">
                <FormControl className="flex flex-col space-y-2" fullWidth={true}>
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

            <div className="dates">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker className="date"
                        label="Data rozpoczęcia"
                        defaultValue={dayjs()}
                        format="DD-MM-YYYY"
                        onChange={(date) => setDateStart(date.format('YYYY-MM-DD'))}/>
                    <DatePicker className="date"
                        label="Data zakończenia"
                        defaultValue={dayjs()}
                        format="DD-MM-YYYY"
                        onChange={(date) => setDateEnd(date.format('YYYY-MM-DD'))}
                    />
                </LocalizationProvider>
            </div>
            
            <div className="contest-type">
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

            <div className="contest-type">
                <FormControl component="fieldset" className="flex flex-col space-y-2">
                <Typography component="legend">Typ zgłoszeń:</Typography>
                <RadioGroup row aria-label="type"
                    name="row-radio-buttons-group"
                    value={type}
                    onChange={(e) => setType(e.target.value)}>
                    <FormControlLabel value="plastyczne" control={<Radio />} label="plastyczne" />
                    <FormControlLabel value="literackie" control={<Radio />} label="literackie" />
                    <FormControlLabel value="inne" control={<Radio />} label="inne: " />
                    <TextField id="other" onChange={(e) => setOtherType(e.target.value)}/>
                </RadioGroup>
                </FormControl>
            </div>

            <div className="uploads">
                <FileUploadButton name="Załącz regulamin" />
                <FileUploadButton name="Załącz plakat" />
            </div>

            <div className="submit">
                <SubmitButton text="Utwórz konkurs" onClick={handleClickOpen}/>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title"> {"Dodano nowy konkurs"} </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus> Ok </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </form>
    )
}

export default ContestForm;