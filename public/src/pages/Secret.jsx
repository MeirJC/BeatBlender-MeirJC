import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
// import "../index.css";

function Secret() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["jwt"]);
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          { withCredentials: true }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else {
          toast.success(
            `Hi ${data.user.slice(0, data.user.indexOf("@"))}, Welcome back!`,
            {
              position: "bottom-right",
              theme: "dark",
            }
          );
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);
  const logOut = () => {
    removeCookie("jwt");
    navigate("/login");
  };
  return (
    <div className="container">
      <div className="private">
        <h1 className="welcome-text-head">Welcome to BeatBlender</h1>
        <button className="logout-btn" onClick={logOut}>
          Log Out
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Secret;
