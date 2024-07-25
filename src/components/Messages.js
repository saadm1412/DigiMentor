import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { app } from '../firebase'; // Import your Firebase configuration
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, getFirestore } from 'firebase/firestore';

const db = getFirestore(app);

const Messages = () => {
  const location = useLocation();
  const { user, batch } = location.state;
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

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
      
        <div className="flex p-2 bg-slate-600 border-t border-gray-200 mb-40 border-l-black">
          <input
            type="text"
            className="flex-grow p-2 border rounded mr-2 h-10 resize-none border-1-black"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message here"
          />
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    
  );
};

export default Messages;
