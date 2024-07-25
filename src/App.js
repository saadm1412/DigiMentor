import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Batch from './components/Batch'; 
import Studentlist from './components/Studentlist';
import Messages from './components/Messages';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Read login state from localStorage
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login handleLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/batch" element={<Batch />} />
                    <Route path="/studentlist" element={<Studentlist />} />
                    <Route path="/messages" element={<Messages />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
