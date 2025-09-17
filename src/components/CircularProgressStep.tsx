import React from "react";

const CircularProgressStep = ({ status }: any) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outermost ring */}
      {status === "isActive" ? (
        <img src="/active-icon.svg" alt="Outer Ring" className={``} />
      ) : status === "isCompleted" ? (
        <img src="/checked-icon.svg" alt="Outer Ring" className={``} />
      ) : (
        <img src="/inactive-icon.svg" alt="Outer Ring" className={``} />
      )}
    </div>
  );
};

export default CircularProgressStep;
