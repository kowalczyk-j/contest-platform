import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, Button, Typography, DialogContent, DialogContentText } from '@mui/material';
import FileUploadButton from './FileUploadButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import SubmitButton from './SubmitButton';
import axios from 'axios';
import TextButton from './TextButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function EntryForm({ contestId, onSubmit }) {
    const [contestantName, setContestantName] = useState('');
    const [parentName, setParentName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [entryTitle, setEntryTitle] = useState('');

    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}api/contests/${contestId}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + sessionStorage.getItem("accessToken")
            }
        })
            .then(response => {
                console.log(response.data);
                setContest(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [contestId]);

    // pop up after submiting
    const [open, setOpen] = React.useState(false);
    const [openError, setOpenError] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
        navigate("/");
    };

    const handleCloseError = () => {
        setOpenError(false);
    }

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await onSubmit({
                contest: contestId, contestant_name: contestantName,
                parent_name: parentName, contestant_surname: surname, email,
                entry_title: entryTitle
            });
            if (response.status === 201) {
                setOpen(true);
            } else {
                setOpenError(true);
            }
        } catch (error) {
            setOpenError(true);
            console.error('Error:', error);
        }

    };

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            <Typography variant="h4" style={{ fontWeight: "bold", letterSpacing: 1.3 }}>{contest.title}</Typography>
            <Typography variant="body1" style={{ fontWeight: "lighter" }}>{contest.description}</Typography>
            <TextButton style={{ fontSize: "1rem", color: "#95C21E" }} endIcon={<ArrowForwardIcon />}>Regulamin</TextButton>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="name">
                    <FormControl className="flex flex-col space-y-4" fullWidth={true}>
                        <TextField label="Imię uczestnika" value={contestantName} onChange={(e) => setContestantName(e.target.value)} />
                    </FormControl>
                </div>

                <div className="surname">
                    <FormControl className="flex flex-col space-y-4" fullWidth={true}>
                        <TextField label="Nazwisko uczestnika" value={surname} onChange={(e) => setSurname(e.target.value)} />
                    </FormControl>
                </div>

                <div className="parent-name">
                    <FormControl className="flex flex-col space-y-4" fullWidth={true}>
                        <TextField label="Imię rodzica uczestnika" value={parentName} onChange={(e) => setParentName(e.target.value)} />
                    </FormControl>
                </div>

                <div className="email">
                    <FormControl className="flex flex-col space-y-4" fullWidth={true}>
                        <TextField label="Adres e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                </div>

                <div className="entry-title">
                    <FormControl className="flex flex-col space-y-4" fullWidth={true}>
                        <TextField label="Tytuł pracy" value={entryTitle} onChange={(e) => setEntryTitle(e.target.value)} />
                    </FormControl>
                </div>

                <div className="checkbox">
                    <FormControlLabel required control={<Checkbox />} label={
                        <Typography style={{ fontSize: "0.7rem", fontWeight: "lighter" }}>Wyrażam zgodę na przetwarzanie zawartych w niniejszym formularzu zgłoszeniowym moich danych osobowych w postaci imienia, nazwiska, telefonu i maila kontaktowego przez Fundację Bo Warto, z siedzibą w Warszawie (00-713) przy ul. Batalionu AK „Bałtyk 7/U3, w celu udziału w Konkursie Rodzinna recenzja książki dla dzieci, zgodnie z art. 6 ust. 1 lit. a Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 roku w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO). Jeśli zechce Pan/Pani usunąć swoje dane proszę o kontakt z Fundacją BO WARTO, tel. 602 228 732 mail: biuro@fundacjabowarto.pl.</Typography>
                    } />
                </div>

                <div className="entry-buttons">
                    <div className="uploads">
                        <FileUploadButton name="Załącz pracę" />
                    </div>

                    <div className="submit">
                        <SubmitButton text="Zgłoś swoją pracę" />
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title"> {"Dodano nowe zgłoszenie konkursowe"} </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Zostaniesz przekierowany do strony głównej
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} autoFocus> Ok </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={openError}
                            onClose={handleCloseError}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title"> {"Wystąpił błąd przy dodawaniu zgłoszenia"} </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Upewnij się, że wszystkie pola są wypełnione
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseError} autoFocus> Ok </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </form>
        </>

    )
}

export default EntryForm;