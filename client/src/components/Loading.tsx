import React from "react";

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center space-x-2 animate-pulse">
      <div className="w-3 h-3 bg-primary rounded-full"></div>
      <div className="w-3 h-3 bg-primary rounded-full"></div>
      <div className="w-3 h-3 bg-primary rounded-full"></div>
    </div>
  );
};

export default Loading;
