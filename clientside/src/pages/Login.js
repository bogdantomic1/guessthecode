import React from "react";
import axios from "axios";
import { useState } from "react";


const Login = () => {


  const token = sessionStorage.getItem("token");
  if(token){
    window.location.href = "/game";
  }
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginStatus, setLoginStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/login", {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        sessionStorage.setItem("token", res.data.token);
       
        window.location.href = "/game";
      })
      .catch((err) => {
        setLoginStatus(err.response.data);
        console.log(err.response.data);
      });
    setLoginStatus("");
    console.log("Login form submitted:", formData);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="w-96 border rounded px-8 pt-6 pb-8 mb-4 bg-gray-800"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
        <h1 className="text-red-500 text-2xl font-bold">{loginStatus}</h1>
      </form>
    </div>
  );
};
export default Login;
