import './App.css';
import LoginForm from './components/Login';
import UserPage from './components/User';
import AdminPage from './components/AdminPage';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { setCookie } from './components/Utils';

function App() {

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    setIsLogged(cookieValue !== "");
  }, []);

  function logout() {
    setIsLogged(false);
    setCookie('token', "", 7);
    window.location.replace('/');
  };

  return (
    <Router>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/">
                        Thales - LeHack2024 : The GodFather
                    </Button> 
                </Typography>
                {!isLogged && (
                <Button color="inherit" className="bordered" component={Link} to="/">
                    Sign up
                </Button>
                )}
                {isLogged && (
                    <Button color="inherit" className="bordered" component={Link} to="/user">
                        My Info
                    </Button>
                )}
                {isLogged && (
                    <Button color="inherit" className="bordered" component={Link} to="/admin">
                        Administration
                    </Button>
                )}
                {isLogged && (
                    <Button color="inherit" className="bordered" onClick={logout}>
                        Sign out
                    </Button>
                )}
            </Toolbar>
        </AppBar>

        <div class="container">
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </div>
    </Router>
  );
}

export default App;
