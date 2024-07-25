import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { app } from '../firebase';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);
const db = getFirestore(app);

const Login = ({ handleLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isStudentLogin, setIsStudentLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const getBatch = (prn) => {
        const prnNumber = parseInt(prn.substring(6));
        if (prnNumber <= 24) return 'B-1';
        if (prnNumber <= 50) return 'B-2';
        return 'B-3';
    };

    const handleLoginClick = async (e) => {
        e.preventDefault();
    
        try {
            if (isStudentLogin) {
                // Student login using email/password
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const studentQuery = query(collection(db, 'students'), where('email', '==', email));
                const querySnapshot = await getDocs(studentQuery);
    
                if (!querySnapshot.empty) {
                    const studentData = querySnapshot.docs[0].data();
                    const batch = getBatch(studentData.prn);
    
                    // Fetch mentor's name based on the student's batch
                    const mentorQuery = query(collection(db, 'mentor'), where('batch', '==', batch));
                    const mentorSnapshot = await getDocs(mentorQuery);
    
                    if (!mentorSnapshot.empty) {
                        const mentorData = mentorSnapshot.docs[0].data();
                        
                        handleLogin();
                        navigate('/batch', { state: { user: { ...studentData, role: 'student', mentorName: mentorData.name }, batch } });
                    }
                }
            } else {
                // Mentor login using username/password stored in Firestore
                const mentorQuery = query(collection(db, 'mentor'), where('username', '==', username));
                const querySnapshot = await getDocs(mentorQuery);
    
                if (!querySnapshot.empty) {
                    // Mentor found, check password
                    const mentorData = querySnapshot.docs[0].data();
                    if (mentorData.password === password) {
                        const batchQuery = query(collection(db, 'mentor'), where('name', '==', mentorData.name));
                        const batchSnapshot = await getDocs(batchQuery);
                        const batch = batchSnapshot.docs[0].data().batch;
    
                        handleLogin();
                        navigate('/batch', { state: { user: { ...mentorData, role: 'mentor' }, batch } });
                    } else {
                        console.error('Invalid password for mentor');
                    }
                } else {
                    console.error('Mentor not found');
                }
            }
        } catch (error) {
            console.error('Error signing in:', error.message);
        }
    };
    
    return (
        <div className="flex flex-col items-center min-h-screen bg-pink-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md mt-28">
                {isStudentLogin ? (
                    <>
                        <h2 className="text-center text-xl mb-4">Login as Student</h2>
                        <form onSubmit={handleLoginClick}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                        <FaUser className="text-gray-500" />
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-2 pl-8 border border-gray-300 rounded mt-1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                        <FaLock className="text-gray-500" />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-2 pl-8 border border-gray-300 rounded mt-1"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-2"
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? <MdVisibilityOff className="text-gray-500" /> : <MdVisibility className="text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">Login</button>
                        </form>
                        <p className="text-center mt-4">
                            or <span className="text-red-500 cursor-pointer" onClick={() => setIsStudentLogin(false)}>Continue as Mentor</span>
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-center text-xl mb-4">Login as Mentor</h2>
                        <form onSubmit={handleLoginClick}>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-gray-700">Username</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                        <FaUser className="text-gray-500" />
                                    </span>
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full p-2 pl-8 border border-gray-300 rounded mt-1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-gray-700">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                        <FaLock className="text-gray-500" />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-2 pl-8 border border-gray-300 rounded mt-1"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-2"
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? <MdVisibilityOff className="text-gray-500" /> : <MdVisibility className="text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">Login</button>
                        </form>
                        <p className="text-center mt-4">
                            or <span className="text-red-500 cursor-pointer" onClick={() => setIsStudentLogin(true)}>Continue as Student</span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
