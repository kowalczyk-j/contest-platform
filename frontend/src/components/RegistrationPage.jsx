import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Typography, TextField, Button, FormControl, FormControlLabel, Radio, RadioGroup, Grid } from '@mui/material';
import Logo from '../static/assets/Logo.png';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'
import axios from "axios";
import Navbar from "./Navbar";
import BackButton from "./BackButton";
import { ThemeProvider } from "@mui/material/styles";
import montserrat from "../static/theme";


const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationError, setRegistrationError] = useState('');
    const [registrationErrorMessage, setRegistrationErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (event) => {
        event.preventDefault();

        const postData = {
            username: username,
            email: email,
            password: password,
        };

        axios.post(`${import.meta.env.VITE_API_URL}api/users/`, postData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(setRegistrationError(false))
            .catch(error => {
                console.log(error);
                setRegistrationError(true);
                setRegistrationErrorMessage(JSON.stringify(error.response.data, null, 2));
            });
    };

    const handleBack = () => {
        setRegistrationError(false);
        setRegistrationErrorMessage("");
        navigate("/");
    };

    return (
        <ThemeProvider theme={montserrat}>
            <div>
                <div className="back-btn">
                    <BackButton clickHandler={handleBack} />
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img style={{ width: "200px" }} src={Logo} alt="Logo" />
                </div>
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Card>
                            <CardHeader title="Rejestracja" />
                            <CardContent>
                                <form onSubmit={handleRegistration}>
                                    <div>
                                        <FormControl style={{ display: "flex", margin: "2%" }} className="flex flex-col space-y-4">
                                            <TextField id="username" label="Nazwa użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} />
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl style={{ display: "flex", margin: "2%" }} className="flex flex-col space-y-4">
                                            <TextField id="email" label="Adres email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl style={{ display: "flex", margin: "2%" }} className="flex flex-col space-y-4">
                                            <TextField id="password" label="Hasło" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </FormControl>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                        <Popup
                                            trigger={
                                                <Button variant="contained" style={{ backgroundColor: '#95C21E', color: 'white', width: "225px" }} type="submit"
                                                    onClick={registrationError ? close : () => handleBack()}>
                                                    Zarejestruj się
                                                </Button>
                                            }
                                            modal
                                            contentStyle={{
                                                maxWidth: '300px',
                                                borderRadius: '10px',
                                                padding: '20px',
                                                textAlign: 'center',
                                                fontFamily: 'Arial'
                                            }}
                                        >
                                            {(close) => (
                                                <div className='modal'>
                                                    <div className='content'>
                                                        {registrationError ? (
                                                            <React.Fragment>
                                                                Rejestracja nieudana, spróbuj ponownie.
                                                                <br /><br />
                                                                {registrationErrorMessage}
                                                            </React.Fragment>
                                                        ) : (
                                                            'Pomyślnie zarejestrowano!'
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                        <Button variant="contained" style={{ backgroundColor: '#95C21E', color: 'white', width: "80px" }}
                                                            onClick={registrationError ? close : () => handleBack()}>
                                                            OK
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </Popup>
                                    </div>
                                </form>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div >
        </ThemeProvider>
    );
};

export default RegistrationPage;