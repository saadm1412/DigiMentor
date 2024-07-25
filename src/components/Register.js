import React, { useState } from 'react';
import { app } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const auth = getAuth(app);
const db = getFirestore(app); // Ensure db is correctly initialized

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [prn, setPRN] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); // Reset the error message

        // Regular expression to match PRN format (e.g., 21UAD001 to 21UAD070)
        const prnRegex = /^21UAD0[0-7][0-9]$/;

        // Validate PRN format
        if (!prnRegex.test(prn)) {
            setError('Invalid PRN format. PRN should be in the form of 21UAD001 to 21UAD070.');
            return;
        }

        // Determine batch based on PRN
        let batch = '';
        const prnSuffix = parseInt(prn.slice(-3)); // Extract the last three digits after 21UAD
        if (prnSuffix >= 1 && prnSuffix <= 24) {
            batch = 'B-1'; // Batch 1
        } else if (prnSuffix >= 25 && prnSuffix <= 50) {
            batch = 'B-2'; // Batch 2
        } else if (prnSuffix >= 51 && prnSuffix <= 70) {
            batch = 'B-3'; // Batch 3
        } else {
            setError('Invalid PRN. PRN should be in the range of 21UAD001 to 21UAD070.');
            return;
        }

        try {
            // Check if email or PRN already exists
            const q = query(
                collection(db, 'students'),
                where('email', '==', email),
                where('prn', '==', prn),
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError('Email or PRN already exists.');
                return;
            }

            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save additional user information in Firestore
            await setDoc(doc(db, 'students', user.uid), {
                email: email,
                prn: prn,
                password: password,
                batch: batch, 
            });

            alert('Student Registered Successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-pink-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md mt-24">
                <h2 className="text-center text-xl mb-4">
                    Register as Student
                </h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <FaEnvelope className="text-gray-500" />
                            </span>
                            <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                className="w-full p-2 pl-8 border border-gray-300 rounded mt-1"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">PRN</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <FaUser className="text-gray-500" />
                            </span>
                            <input
                                type="text"
                                onChange={(e) => setPRN(e.target.value)}
                                value={prn}
                                required
                                className="w-full p-2 pl-8 border border-gray-300 rounded mt-1"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Set Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <FaLock className="text-gray-500" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                                className="w-full p-2 pl-8 border border-gray-300 rounded mt-1"
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
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
