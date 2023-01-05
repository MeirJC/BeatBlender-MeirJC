import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import axios from "axios";

function Login() {
  const [cookies] = useCookies(["jwt", "", { SameSite: false }]);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (cookies.jwt) {
      navigate("/");
    }
  }, [cookies, navigate]);
  const generateError = (err) =>
    toast.error(err, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/login",
        {
          ...values,
        },
        {
          withCredentials: true,
        }
      );

      if (data) {
        if (data.errors) {
          const { email } = data.errors;

          if (email) {
            generateError(data.errors.email);
          }
        } else if (data.created) {
          toast.success("Login completed successfully");
          setTimeout(() => {
            navigate("/");
          }, 2500);
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
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
        <h2>Login Account</h2>
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
            Dont have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
