import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { API, setCookie } from './Utils';

const LoginForm = () => {

    const[formData, setFormData] = useState({
            username:'',
            email:'',
            password:'',
        }
    );
    const navigate = useNavigate(); 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            alert('Please fill out all required fields');
            return;
        }

        if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            alert('Please enter a valid email address');
            return;
        }

        try {           
            const response = await fetch(API + '/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData), 
            });

            if (response.ok) {
                const data = await response.json();

                if(data.message === "ok") {
                    setCookie('token', data.token, 7);
                    window.location.replace('/user');
                }
                else {                    
                    navigate("/")
                }         
            } 
            else {
                const data = await response.json();
                if(data.error) {               
                    alert(data.error)
                }
            }
        }
        catch (error) {
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Registration
                </Typography>

                <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        name="username"
                        inputProps={{
                            maxLength: 20,
                            minLength: 3,
                          }}
                        value={formData.username}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        inputProps={{
                            maxLength: 42,
                            minLength: 12,
                          }}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Sign up and join the family
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
