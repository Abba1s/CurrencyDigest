import React from "react";
import className from "classnames";

const Button = ({
  children,
  primary,
  secondary,
  success,
  warning,
  danger,
  rounded,
  uploadBtn,
}) => {
  const classes = className(
    "px-3 py-1.5 border flex justify-center items-center",
    {
      "border-blue-500 bg-indigo-600 text-white": primary,
      "border-gray-300 bg-white text-gray-700": secondary,
      "border-green-500 bg-green-500 text-white": success,
      "border-yellow-400 bg-yellow-400 text-white": warning,
      "border-red-500 bg-red-500 text-white": danger,
      "max-h-[34px] border-gray-300 text-gray-700 font-[600] text-[14px] leading-[16px]":
        uploadBtn,
      rounded: rounded,
    }
  );

  return <button className={classes}>{children}</button>;
};

Button.propTypes = {
  checkVariationValue: ({
    primary,
    secondary,
    uploadBtn,
    success,
    danger,
    warning,
  }) => {
    const count =
      Number(!!primary) +
      Number(!!secondary) +
      Number(!!uploadBtn) +
      Number(!!success) +
      Number(!!danger) +
      Number(!!warning);
    if (count > 1) {
      return new Error("Only one of the colors can be applied !");
    }
  },
};

export default Button;
