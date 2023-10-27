import React from "react";

const PopupMessage = ({ message }) => {
  return (
    <div className="popup-message">
      <p>{message}</p>
    </div>
  );
};

export default PopupMessage;