// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../IMG/dktelogo.png'; // Adjust the path if necessary

const Navbar = ({ isLoggedIn, handleLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/');
    };

    return (
        <nav className="bg-[#2b0318] px-6 flex items-center justify-between">
            <div className="flex items-center">
                <img src={logo} alt="College Logo" className="w-65 h-40" />
            </div>
            <ul className="flex space-x-6">
                {isLoggedIn ? (
                    <>
                     <li>
                            <button onClick={handleLogoutClick} className="text-white text-xl">Logout</button>
                    </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/" className="text-white text-xl">Home</Link></li>
                        <li><Link to="/login" className="text-white text-xl">Login</Link></li>
                        <li><Link to="/register" className="text-white text-xl">Sign-Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
