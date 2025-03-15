import React from "react";
import { useSelector } from "react-redux";

const ButtonLoader = ({ buttonId, children, onClick, className, type = "button" }) => {
  const { buttonLoading } = useSelector((state) => state.loader);
  const isLoading = buttonLoading[buttonId] || false; 

  return (
    <button
      type={type}
      className={`${className} flex items-center justify-center gap-2`} 
      onClick={!isLoading ? onClick : null}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="tracking-wide">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonLoader;
