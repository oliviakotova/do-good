import React from "react";

const Help = (props) => {
  return (
    <div className="info-modal">
      <span className="close-icon" onClick={props.handleClose}>
        x
      </span>
      {props.content}
    </div>
  );
};

export default Help;
