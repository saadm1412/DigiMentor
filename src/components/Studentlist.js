import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

const Enrollment = () => {
    const location = useLocation();
    const { user, batch } = location.state;
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const q = query(collection(db, 'students'), where('batch', '==', batch));
            const querySnapshot = await getDocs(q);
            const studentsList = querySnapshot.docs.map(doc => doc.data());
            setStudents(studentsList);
        };

        fetchStudents();
    }, [batch]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-pink-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mt-11">
            <h2 className="text-center text-3xl font-bold mb-6">Student Enrollment for {batch}</h2>
            <p className="text-center text-xl font-semibold mb-6">Mentor: {user.name}</p>
            <ul className="divide-y divide-gray-200">
                {students.map((student, index) => (
                    <li key={index} className="py-4 flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-700">{student.prn}</span>
                        <span className="text-lg text-gray-600">{student.email}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
    );
};

export default Enrollment;
