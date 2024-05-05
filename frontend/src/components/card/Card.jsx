import React from "react";

const Card = ({ title, autthor, description, image }) => {
  return (
    <>
      <div className="flex flex-col border-2 border-gray-400 shadow-md rounded max-h-[40rem] gap-2 p-3 overflow-hidden">
        <img className="object-cover" src={image} alt="pic" />
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="text-base text-gray-600">{description}</div>
      </div>
    </>
  );
};

export default Card;
