// src/components/Login.jsx
import React, { useState } from 'react';

const Login = () => {
    const [isStudentLogin, setIsStudentLogin] = useState(true);

    return (
        <div className="flex flex-col items-center min-h-screen bg-pink-100">
            {isStudentLogin ? (
                <div className="bg-white p-6 rounded shadow-md w-full max-w-md mt-28">
                    <h2 className="text-center text-xl mb-4">Login as Student</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">PRN</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <input type="password" className="w-full p-2 border border-gray-300 rounded mt-1" />
                        </div>
                        <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">Login</button>
                    </form>
                    <p className="text-center mt-4">
                        or <span className="text-red-500 cursor-pointer" onClick={() => setIsStudentLogin(false)}>Continue as Mentor</span>
                    </p>
                </div>
            ) : (
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-28">
                    <h2 className="text-center text-xl mb-4">Login as Mentor</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Username</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Password</label>
                            <input type="password" className="w-full p-2 border border-gray-300 rounded mt-1" />
                        </div>
                        <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">Login</button>
                    </form>
                    <p className="text-center mt-4">
                        or <span className="text-red-500 cursor-pointer" onClick={() => setIsStudentLogin(true)}>Continue as Student</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Login;
