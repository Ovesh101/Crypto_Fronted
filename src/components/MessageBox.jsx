import React from 'react';

const MessageBox = ({ name }) => {
  let message;

  // Determine the message based on the name prop
  switch (name) {
    case 'deposit':
      message = 'Your deposit has been successful!';
      break;
    case 'withdrawal':
      message = 'Your withdrawal request has been processed!';
      break;
    case 'machine_listing':
      message = 'New machines have been listed successfully! New machines have been listed successfully! New machines have been listed successfully! New machines have been listed successfully! New machines have been listed successfully!';
      break;
    case 'buy_machine':
      message = 'You are about to buy a machine.';
      break;
    default:
      message = 'This is a message! You can close this by clicking the cross icon.';
  }

  return (
    <div className="bg-[#7D60F9] bg-opacity-40 text-white p-4 mb-5 rounded-md shadow-md flex items-center justify-between">
      {/* Message content */}
      <p className="text-sm">{message}</p>
      {/* Close icon can be added here if needed */}

    </div>
  );
};

export default MessageBox;
