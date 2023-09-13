import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [orderBy, setOrderBy] = useState("score");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/leaderboard`, {
        params: {
          searchTerm,
          orderBy,
          orderDirection,
        },
      })
      .then((response) => {
        setLeaderboardData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [searchTerm, orderBy, orderDirection]);

  console.log(leaderboardData);
  const handleSort = (column) => {
    if (orderBy === column) {
      // If already sorting by the same column, toggle the direction
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a different column, set it as the new sorting column and default to descending order
      setOrderBy(column);
      setOrderDirection("desc");
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen ">
      <Navbar />
      <div className="container mx-auto p-6 ">
        <h1 className="text-3xl font-semibold text-white mb-6 ">Leaderboard</h1>
        <div className="mb-4 flex space-x-4">
          <input
            type="text"
            placeholder="Search username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1234 px-9 py-2 rounded bg-gray-700 text-white"
          />
        </div>
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th
                className="text-white w-1/4 py-2 cursor-pointer"
                onClick={() => handleSort("username")}
              >
                Username
              </th>
              <th
                className="text-white w-1/4 py-2 cursor-pointer"
                onClick={() => handleSort("score")}
              >
                Score
              </th>
              <th
                className="text-white w-1/4 py-2 cursor-pointer"
                onClick={() => handleSort("average_score")}
              >
                Average Score
              </th>
              <th
                className="text-white w-1/4 py-2 cursor-pointer"
                onClick={() => handleSort("number_of_games")}
              >
                Number of Games
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((item, index) => (
              <tr key={index} className="hover:bg-blue-800 hover:rounded-md transition duration-200">
                <td className="text-white py-2 text-center">{item.username}</td>
                <td className="text-white py-2 text-center">{item.score}</td>
                <td className="text-white py-2 text-center">{item.average_score}</td>
                <td className="text-white py-2 text-center">{item.number_of_games}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
