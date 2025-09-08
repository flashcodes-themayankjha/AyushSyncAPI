import React from 'react';

const Chatbot = ({ scrollPosition, onClose }) => {
  return (
    <div className="fixed bottom-20 right-20 w-96 h-1/2 bg-white border border-gray-300 rounded-lg shadow-lg z-1000 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-blue-500 text-white rounded-t-lg">
        <h2 className="text-lg font-bold">Chatbot</h2>
        <button onClick={onClose} className="text-white font-bold">X</button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <p>Hello! How can I help you today?</p>
      </div>
      <div className="p-4 border-t border-gray-300">
        <input type="text" placeholder="Type your message..." className="w-full p-2 border border-gray-300 rounded-lg" />
      </div>
    </div>
  );
};

export default Chatbot;
