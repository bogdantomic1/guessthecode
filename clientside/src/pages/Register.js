import React from "react";
import axios from "axios";
import {  useState } from "react";

const Register = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    window.location.href = "/game";
  }
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //check if the email or username already exists in the database
    // axios
    //   .post("http://localhost:3000/check", {
    //     email: formData.email,
    //     username: formData.username,
    //   })
    //   .then((res) => {
    //     if (res.data.length > 0) {
    //       alert("Email or username already exists!");
    //       return;
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    //check if email has @
    if (!formData.email.includes("@")) {
      alert("Email is invalid!");
      return;
    }

    // Check if the passwords match
    if (formData.password !== formData.repeatPassword) {
      alert("Passwords don't match!");
      return;
    }

    //password restrictions
    if (formData.password.length < 4) {
      alert("Password must be at least 8 characters!");
      return;
    }

    // Here, you can implement the logic to check if the email or username already exists in the database
    // If they do, you can show an error message, otherwise, you can submit the data to the database
    axios
      .post("http://localhost:3000/register", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      })
      .then((res) => {
        window.location.href = "/login";
      })
      .catch((err) => {
        if (err.response) {
          alert("Registration error: " + err.response.data.error);
          console.error("Error response from server:", err.response.data.error);
        } else {
          alert(
            "An error occurred during registration. Please try again later."
          );
          console.error("Error:", err.message);
        }
      });
    // Simulating a successful registration
    setFormData({
      email: "",
      username: "",
      password: "",
      repeatPassword: "",
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="w-96 border rounded px-8 pt-6 pb-8 mb-4 bg-gray-800"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
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
            className="block text-white text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
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
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="repeatPassword"
          >
            Repeat Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
            type="password"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
