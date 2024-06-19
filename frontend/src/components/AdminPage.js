import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { API, getCookie } from './Utils';

const AdminPage = () => {

    let [isAdmin, setIsAdmin] = useState(false); 
    let [flag, setFlag] = useState(false); 

    useEffect(() => {
        const loadAdmin = async () => {
            const isAdminStatus = await fetchIsAdmin();
            setIsAdmin(isAdminStatus);  
        };

        loadAdmin();
    }, []); 

    const fetchIsAdmin = async () => {
        try {
            const token = getCookie("token")

            const response = await fetch(API + '/admin', {
                method: 'GET',
                headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
            });
            
            if (response.ok) {
                const data = await response.json();
                setFlag(data['flag'])
                return Boolean(data.admin);
            } 
            else {
                return false;
            }
        } 
        catch (error) {
            return false;
        }
    };


    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                {isAdmin ? (
                    <div>

                    <Typography variant="h4" gutterBottom>
                        Hello, Admin !
                    </Typography>
                    <Typography>
                        Flag : {flag}
                    </Typography>
                    </div>

                ) : (
                    <Alert severity="warning">
                        This page is restricted.
                    </Alert>
                )}
            </Box>
        </Container>
    );
};

export default AdminPage;
