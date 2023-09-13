import React from "react";

const Overlay = ({ message, onClose }) => {
  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-80">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
        <p className="text-5xl text-white mb-4 text-center">{message}</p>
        <button
          className="block mx-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handlePlayAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default Overlay;
