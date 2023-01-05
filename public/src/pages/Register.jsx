import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/register",
        {
          ...values,
        },
        {
          withCredentials: true,
        }
      );
      console.log("1 - Data from axios try:", data);
      if (data) {
        console.log("2 - Data from axios try:", data);
        if (data.errors) {
          // console.log("3 -data.errors:", data.errors);
          const { email, password } = data.errors;
          // console.log("4 - email:", email, "5 - password:", password);
          if (email) {
            // console.log("6 - email:", email);
            generateError(data.errors.email);
          } else if (password.length < 6) {
            // console.log("7 - password:", password);
            generateError(data.err.errors.password.properties.message);
          }
          // console.log("Error:", data.error.message);
          // toast.error(data.error.message);
        } else if (data.created) {
          toast.success("Registration completed successfully");
          setTimeout(() => {
            navigate("/");
          }, 2500);
        }
      }
    } catch (err) {
      console.log("Error:", err);
    }
    // console.log("values useState data:", values);
    // toast.success("Login Success");
  };
  return (
    <div className="container">
      <h1 className="main-head">
        <span className="markup main-dist">B</span>eat
        <span className="markup main-dist">B</span>
        lender
      </h1>
      <p className="subtext">Mix and Chill</p>
      <div className="form-container">
        <h2>Register Account</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              autoComplete="on"
              type="email"
              id="email"
              name="email"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              autoComplete="on"
              type="password"
              id="password"
              name="password"
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            />
          </div>
          <button className="log-btn" type="submit">
            Submit
          </button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Register;
