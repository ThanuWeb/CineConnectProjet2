import React, { useState } from "react";
import { Link } from "@tanstack/react-router";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navBar p-4 bg-black text-white">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xl">CineConnect</span>

        <ul className="hidden md:flex list-none gap-8 text-white">
          <Link to="/film"><li>Films</li></Link>
          <Link to="/documentaries"><li>Documentaires</li></Link>
          <Link to="/faq"><li>FAQ</li></Link>
          <Link to="/help"><li>Aides</li></Link>
        </ul>

        <div className="hidden md:flex gap-2">
          <Link to="/login">
            <button className="bg-white text-black p-2 rounded border-2">
              S'identifier
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-white text-black p-2 rounded border-2">
              S'inscrire
            </button>
          </Link>
        </div>

        {/* Burger button mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

  
     <div
  className={`fixed top-0 right-0 h-full w-64 text-white transform transition-transform duration-300 ${
    menuOpen ? "translate-x-0" : "translate-x-full"
  }`}
  style={{ backgroundColor: "#1f2937", zIndex: 1000 }} 
>
    <div className="flex justify-between items-center p-4 border-b border-gray-700">
      <span className="font-bold text-lg">Menu</span>
      <button className="text-2xl" onClick={() => setMenuOpen(false)}> ✕ </button>
        </div>

        <ul className="flex flex-col gap-6 p-6">
          <Link to="/film"><li className="hover:text-gray-300 cursor-pointer">Films</li></Link>
          <Link to="/documentaries"><li className="hover:text-gray-300 cursor-pointer">Documentaires</li></Link>
          <Link to="/faq"><li className="hover:text-gray-300 cursor-pointer">FAQ</li></Link>
          <Link to="/help"><li className="hover:text-gray-300 cursor-pointer">Aides</li></Link>
        </ul>

        <div className="flex flex-col gap-3 p-6">
          <Link to="/login">
            <button className="bg-gray-700 text-white p-2 rounded border-2 w-full hover:bg-gray-600">
              S'identifier
            </button>
          </Link>

          <Link to="/signup">
            <button className="bg-gray-700 text-white p-2 rounded border-2 w-full hover:bg-gray-600">
              S'inscrire
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;