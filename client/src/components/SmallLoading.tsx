import React from "react";

const Loading = () => {
  return (
    <div className="flex space-x-1 animate-pulse">
      <div className="w-2 h-2 bg-primary rounded-full"></div>
      <div className="w-2 h-2 bg-primary rounded-full"></div>
      <div className="w-2 h-2 bg-primary rounded-full"></div>
    </div>
  );
};

export default Loading;
