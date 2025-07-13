import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-message max-w-md mx-auto">
      <div className="flex items-center justify-center mb-4">
        <FaExclamationTriangle className="text-red-500 text-2xl mr-2" />
        <h3 className="text-lg font-semibold">Something went wrong</h3>
      </div>
      
      <p className="mb-4">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaRedo className="text-sm" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
