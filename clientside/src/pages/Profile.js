import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import jwt_decode from "jwt-decode";

const Profile = () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
  }

  const decodedToken = jwt_decode(token);
  const dToken = parseInt(decodedToken.id);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  const { id } = useParams(); // Get the user's ID from the URL
  const [userData, setUserData] = useState({});
  const dId = parseInt(id);

  if (dToken !== dId) {
    window.location.href = `/profile/${dToken}`;
  }

  useEffect(() => {
    // Fetch user data based on the ID
    axios
      .get(`http://localhost:3000/profile/${id}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [id]);

  const changeUsername = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    axios
      .put(`http://localhost:3000/profile/${id}`, { username })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div className="bg-gray-800 min-h-screen">
      <Navbar />
      <div className="flex flex-col justify-center items-center bg-gray-900 text-white">
        <h1 className="text-7xl mb-6 italic">{userData.username}'s stats</h1>

        {/* Table to display user statistics */}
        <table className="text-2xl w-2/3 border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-center">Score</th>
              <th className="p-2 text-center">Number of Games</th>
              <th className="p-2 text-center">Average Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 text-center">{userData.score}</td>
              <td className="p-2 text-center">{userData.number_of_games}</td>
              <td className="p-2 text-center">{userData.average_score}</td>
            </tr>
          </tbody>
        </table>

        {/* Update Username Section */}
        <div className="bg-gray-800 p-6 rounded w-full m-10">
          <h2 className="text-3xl mb-2">Update Username</h2>
          <form onSubmit={changeUsername}>
            <div className="mb-4">
              <label htmlFor="newUsername" className="block text-xl mb-1">
                New Username:
              </label>
              <input
                type="text"
                name="username"
                className="px-3 py-2 rounded bg-gray-700 text-white"
                placeholder="Enter new username"
              />
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Username
              </button>
            </div>
          </form>
        </div>

        <button
          className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
