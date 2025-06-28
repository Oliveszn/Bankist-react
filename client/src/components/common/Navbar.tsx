import { useState } from "react";
import logo from "../../../public/logo.png";
import { useAppSelector } from "../../store/hooks";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  let links = [
    { name: "Home", link: "/shop" },
    { name: "About", link: "/about" },
    { name: "Contact Us", link: "/store" },
  ];

  return (
    <nav className="w-full shadow-bottom bg-[#ffffff]">
      <div className=" flex justify-between items-center py-4 px-6">
        {user ? (
          <p className="text-xl sm:text-2xl lg:text-3xl font-medium">
            {" "}
            Welcome back, {user}
          </p>
        ) : (
          <img src={logo} alt="logo" className="h-12" />
        )}

        <div>
          <ul className="flex flex-row items-center gap-6">
            {links.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  key={item.name}
                  className="relative hover:opacity-50"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center gap-4">
          {user && (
            <div>
              <button>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <button
                onClick={() =>
                  navigate("/login", { state: { from: location.pathname } })
                }
                className="bg-emerald-700 text-white px-4 py-3 rounded-full cursor-pointer hover:opacity-50 whitespace-nowrap shadow-lg"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
