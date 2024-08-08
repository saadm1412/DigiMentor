import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { app } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, getFirestore } from 'firebase/firestore';
import { IoIosCheckmarkCircle } from 'react-icons/io'; // Import the attendance icon
import { VscAccount } from "react-icons/vsc";


const db = getFirestore(app);

const Messages = () => {
  const location = useLocation();
  const { user, batch } = location.state;
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [attendanceEnabled, setAttendanceEnabled] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('batch', '==', batch),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [batch]);

  useEffect(() => {
    const checkAttendanceTime = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const minute = now.getMinutes();
      if (day === 1 && hour === 17 && minute >= 0 && minute <= 59) {
        setAttendanceEnabled(true);
      } else {
        setAttendanceEnabled(false);
      }
    };

    checkAttendanceTime(); // Check once when the component mounts
    const intervalId = setInterval(checkAttendanceTime, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  const sendMessage = async () => {
    if (content.trim()) {
      const senderId = user.role === 'student' ? user.prn : user.username;
      await addDoc(collection(db, 'messages'), {
        batch,
        senderId,
        senderType: user.role,
        content,
        timestamp: Timestamp.now(),
      });
      setContent('');
    }
  };

  const markAttendance = async () => {
    if (attendanceEnabled) {
      const senderId = user.role === 'student' ? user.prn : user.username;
      await addDoc(collection(db, 'attendance'), {
        batch,
        senderId,
        senderType: user.role,
        status: 'present',
        timestamp: Timestamp.now(),
      });
      alert('Attendance marked successfully.');
    } else {
      alert('Attendance can only be marked on Mondays from 5 PM to 6 PM.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-col flex-grow overflow-auto p-4">
        <div className="flex flex-col-reverse">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col mb-2 ${msg.senderId === (user.role === 'student' ? user.prn : user.username) ? 'items-end' : 'items-start'}`}>
              <div className="text-xs text-gray-500 mb-1">
                {msg.senderType.charAt(0).toUpperCase() + msg.senderType.slice(1)}
              </div>
              <div className={`p-2 rounded-lg ${msg.senderId === (user.role === 'student' ? user.prn : user.username) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                <span>{msg.content}</span>
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(msg.timestamp.toDate()).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="p-2 bg-slate-600">
        <div className="container mx-auto flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded mr-2 h-10 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message here"
          />
          <button
            className="p-2 bg-blue-500 text-white rounded mr-2"
            onClick={sendMessage}
          >
            Send
          </button> 
          <button
            className={`p-2 ${attendanceEnabled ? 'bg-green-500' : 'bg-gray-400'} text-white rounded`}
            onClick={markAttendance}
          >
            <VscAccount></VscAccount>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Messages;
