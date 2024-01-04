import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Logo from "../static/assets/Logo.png";

const GreenButton = styled(Button)({
    backgroundColor: "#95C21E",
    color: "white",
    "&:hover": {
        backgroundColor: "#82a819",
    },
});

const UserProfilePage = () => {
    const [user, setUser] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Fetch user data from an API
        axios.get(`${import.meta.env.VITE_API_URL}api/users/current_user/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + sessionStorage.getItem("accessToken")
            }
        })
            .then((response) => {
                setUser(response.data);
            })
            .catch(error => console.error("Error:", error));
    }, []);

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img style={{ width: "200px" }} src={Logo} alt="Logo" />
            </div>

            <Typography
                variant="h4"
                align="center"
                gutterBottom
                style={{ marginTop: "20px" }}
            >
                Profil użytkownika
            </Typography>

            <Card
                style={{
                    width: "300px",
                    margin: "0 auto",
                    marginTop: "20px",
                    padding: "20px",
                }}
            >
                <CardContent>
                    <Typography variant="subtitle1">
                        Nazwa użytkownika: {user.username}
                    </Typography>
                    <Typography variant="subtitle1">
                        email: {user.email}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserProfilePage;
