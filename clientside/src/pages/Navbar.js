// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import profilePic from "../images/image-user-svgrepo-com.svg";
import leaderboardPic from "../images/leaderboard-svgrepo-com.svg";
import jwt_decode from "jwt-decode";

const Navbar = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwt_decode(token);
  const id = decodedToken.id;
  return (
    <nav className="bg-gray-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/game" className="text-white text-2xl font-bold">
            GuessTheCode
          </Link>
          <div className="flex space-x-4">
            <Link
              to={`/profile/${id}`}
              className="text-white hover:text-blue-400 px-3 py-2 rounded transition duration-200"
            >
              <img src={profilePic} alt="profile-page" className="w-8 h-8" />
            </Link>
            <Link
              to="/leaderboard"
              className="text-white hover:text-blue-400 px-3 py-2 rounded transition duration-200"
            >
              <img
                src={leaderboardPic}
                alt="leaderboard-page"
                className="w-8 h-8"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
