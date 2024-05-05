import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Crypto Prices",
      path: "/crypto",
    },
    {
      name: "Blogs",
      path: "/blogs/all",
    },
    {
      name: "Submit Blog",
      path: "/blog/submit",
    },
  ];

  return (
    <>
      <nav className="flex bg-green-200 items-center justify-evenly ">
        <div className="logo">
          <Link to={"/"}>Logo</Link>
        </div>

        <ul className="bg-red-500 flex gap-3">
          {navItems.map((item, index) => {
            return (
              <Link to={item.path} key={index} className="">
                {item.name}
              </Link>
            );
          })}
        </ul>
        <div className="flex gap-3">
          <button>
            <Link to={"auth/login"}>Login</Link>
          </button>
          <button>
            {" "}
            <Link to={"auth/register"}>Register</Link>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
