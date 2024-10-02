import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This mimics the browser back button functionality
  };

  return (
    <button
      onClick={goBack}
      className="px-4 py-2 mb-5 bg-gray-800 border border-[#7D60F9] text-white rounded-full hover:bg-[#7D60F9] transition-all"
    >
      Go Back
    </button>
  );
};

export default BackButton;
