import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, Typography, TextField, Button, FormControl, FormControlLabel, Radio, RadioGroup, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Logo from '../static/assets/Logo.png';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch('http://your-backend-url.com/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const responseData = await response.json();
            const token = responseData.token;

            // Handle the token (e.g., store it in local storage, state, or cookies)
            console.log('Received token:', token);
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    const handleBack = () => { navigate("/"); };

    return (
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
                        <CardHeader title="Logowanie" />
                        <CardContent>
                            <form onSubmit={handleLogin}>
                                <div>
                                    <FormControl style={{ display: "flex", margin: "2%" }} className="flex flex-col space-y-4">
                                        <TextField id="username" label="Nazwa użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </FormControl>
                                </div>
                                <div>
                                    <FormControl style={{ display: "flex", margin: "2%" }} className="flex flex-col space-y-4">
                                        <TextField id="password" label="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </FormControl>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                    <Popup
                                        trigger={
                                            <Button variant="contained" style={{ backgroundColor: '#95C21E', color: 'white', width: "225px" }} type="submit">
                                                Zaloguj się
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
                                                    Pomyślnie zalogowano!
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                    <Button variant="contained" style={{ backgroundColor: '#95C21E', color: 'white', width: "80px" }} onClick={() => handleBack()}>
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
    );
};

export default LoginPage;