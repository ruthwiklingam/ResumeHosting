import React from 'react';

const LoadingSpinner = ({ message = 'Loading resume...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="loading-spinner mb-4"></div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
