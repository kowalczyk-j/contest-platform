import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Typography, TextField, Button, FormControl, FormControlLabel, Checkbox, Grid } from '@mui/material';
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
    const [isCoordinatingUnit, setCoordinatingUnit] = useState(false);
    const [registrationError, setRegistrationError] = useState('');
    const [registrationErrorMessage, setRegistrationErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (event) => {
        event.preventDefault();

        const postData = {
            username: username,
            email: email,
            password: password,
            is_coordinating_unit: isCoordinatingUnit,
        };

        axios.post(`${import.meta.env.VITE_API_URL}api/users/`, postData, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                setRegistrationError(false);
                console.log(postData);
                console.log(response);
            })
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
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img style={{ width: "200px" }} src={Logo} alt="Logo" />
                </div>
                <Button style={{ display: "flex", flexDirection: "row", marginInline: "22%", alignItems: "baseline" }} onClick={() => handleBack()}>
                    Powrót
                </Button>
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
                                            <TextField id="password" label="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </FormControl>
                                    </div>

                                    <div className="checkbox">
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            style={{ margin: "15px" }}
                                            onChange={(e) => setCoordinatingUnit(e.target.checked)}
                                            label={
                                                <Typography style={{ maxWidth: "400px", fontWeight: "lighter" }}>
                                                    Zarejestruj mnie jako jednostkę koordynującą.
                                                </Typography>
                                            }
                                        />
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
        </ThemeProvider >
    );
};

export default RegistrationPage;