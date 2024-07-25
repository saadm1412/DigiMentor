import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Batch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, batch } = location.state;

  const handleEnrollmentClick = () => {
    navigate('/studentlist', { state: { user, batch } });
  };

  const handleMessagesClick = () => {
    navigate('/messages', { state: { user, batch } });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-pink-100">
      <div
        className="bg-blue-500 text-white text-3xl py-4 px-12 rounded mt-24 cursor-pointer flex justify-between items-center w-4/5"
        onClick={handleMessagesClick}
      >
        <span>Batch: {batch}</span>
        <span>{user.role === 'mentor' ? user.name : user.mentorName}</span>
      </div>
      {user.role === 'mentor' && (
        <div className="mt-4 w-full max-w-md">
          <button
            className="bg-[#831e52] text-white text-xl py-2 px-4 rounded w-full mt-5"
            onClick={handleEnrollmentClick}
          >
            View Student Enrollment
          </button>
          <button className="bg-[#831e52] text-white text-xl py-2 px-4 rounded w-full mt-3">
            View Student Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default Batch;
