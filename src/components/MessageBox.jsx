import React, { useState } from 'react';
import { X } from 'lucide-react';  // Importing the cross icon

const MessageBox = () => {
  const [isVisible, setIsVisible] = useState(true);  // State to control visibility

  // Function to hide the message box
  const handleClose = () => {
    setIsVisible(false);
  };

  // Conditionally render the message box based on visibility
  if (!isVisible) return null;

  return (
    <div className="bg-[#7D60F9] bg-opacity-40 text-white p-4 mb-5 rounded-md shadow-md flex items-center justify-between">
      {/* Message content */}
      <p className="text-sm">
        This is a message! You can close this by clicking the cross icon.
      </p>

      {/* Cross Icon */}
      <button onClick={handleClose} className="ml-4">
        <X size={20} className="hover:text-gray-300" />  {/* Close icon */}
      </button>
    </div>
  );
};

export default MessageBox;
