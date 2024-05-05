import React from "react";

const Input = (props) => {
  return (
    <>
      <div className="input">
        <input type={props.type} {...props} />
      </div>
    </>
  );
};

export default Input;
