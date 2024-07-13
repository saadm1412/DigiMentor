// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
