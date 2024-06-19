import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { API, getCookie } from './Utils';

const UserPage = () => {

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        godfather_email: ''
    });
    
    const [godfatherEmail, setGodfatherEmail] = useState('');

    const handleSponsorChange = (e) => {
        setGodfatherEmail(e.target.value);
    };

    const handleAddSponsor = async (e) => {
        e.preventDefault();

        if (!godfatherEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            const token = getCookie("token")
            const response = await fetch(API + '/update', {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
                body: JSON.stringify({"godfather_email": godfatherEmail})
            });
            
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } 
        } 
        catch (error) {
        }
    };

    const fetchUserData = async () => {
        const token = getCookie("token")
        try {
            const response = await fetch(API + '/user/me', {
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + token}
            });
            
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } 
        } 
        catch (error) {
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        User info
                    </Typography>
                    <Typography variant="body1">Username: {userData.username}</Typography>
                    <Typography variant="body1">Email: {userData.email}</Typography>
                    <Typography variant="body1">Godfather's email: {userData.godfather_email ? userData.godfather_email : "" }</Typography>

                </Paper>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Add my GodFather
                    </Typography>
                    <Box component="form" autoComplete="off">
                        <TextField
                            label="GodFather's email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            inputProps={{
                                maxLength: 25,
                                minLength: 5,
                              }}
                            value={godfatherEmail}
                            onChange={handleSponsorChange}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleAddSponsor}
                        >
                            Update
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default UserPage;
