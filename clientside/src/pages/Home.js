import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

function Home() {
  const token = sessionStorage.getItem("token");
  if (token) {
    window.location.href = "/game";
  }
  return (
    <div className="flex h-screen bg-gray-900 items-center justify-center">
      <div className="flex flex-col items-center">
        <a
          href="/login"
          className="text-white text-2xl font-semibold mb-4 hover:text-blue-300"
        >
          Login
        </a>
        <a
          href="/register"
          className="text-white text-2xl font-semibold hover:text-blue-300"
        >
          Register
        </a>
      </div>
    </div>
  );
}

export default Home;
