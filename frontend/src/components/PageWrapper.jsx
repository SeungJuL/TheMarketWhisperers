import React from "react";

const PageWrapper = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      {children}
    </div>
  );
};

export default PageWrapper;
