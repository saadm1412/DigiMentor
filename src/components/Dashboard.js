// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import background from '../IMG/dkte.jpg'; // Adjust the path if necessary

const Dashboard = () => {
    return (
        <div
            className="flex flex-col  min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${background})`, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            backgroundBlendMode: 'darken', }}
        >
            <div className="bg-black bg-opacity-50 p-4 rounded-lg text-center mt-40 ml-28 mr-28">
                <h2 className="text-white text-4xl mb-4">Welcome to the Digital Mentoring Platform</h2>
                <p className="text-white text-lg mb-8">
                    This platform is designed to facilitate mentoring and support for students, providing a seamless way to connect with mentors and access resources.
                </p>
                <Link to="/login">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition duration-300">
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
