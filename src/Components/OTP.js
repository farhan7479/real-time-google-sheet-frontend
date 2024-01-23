import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const OTP = () => {
  const state = useLocation().state;
  const { Email } = state;
  const authtoken = localStorage.getItem("sheets-auth-token");
  const [otp, setotp] = useState("");
  const [Loading, setLoading] = useState(false);
  const baseURL = "https://sheets-backend-tdmn.onrender.com";
  const Navigate = useNavigate();
  useEffect(() => {
    if (authtoken) {
      Navigate("/");
    }
  }, []);
  const otpOnChange = (event) => {
    setotp(event.target.value);
  };
  const SignUpHandler = async () => {
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!otp) {
      alert("Please enter all Details");
      setLoading(false);
    } else {
      const data = {
        otp: otp,
        email: Email,
      };
      const url = `${baseURL}/api/auth/VerifyOTP`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      console.log(jsonData);
      setLoading(false);

      if (jsonData.error) {
        alert(jsonData.error);
      } else if (jsonData.authtoken) {
        localStorage.setItem("sheets-auth-token", jsonData.authtoken);
        Navigate("/");
      } else {
        alert("An issue occured, Pls report");
        setLoading(false);
      }
    }
  };
  return (
    <>
      <div
        className={`SignUPMain container-fluid d-flex align-items-center justify-content-center ${
          Loading ? "" : "Collapsed"
        }`}
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div
        className={`SignUPMain container-fluid d-flex align-items-center justify-content-center ${
          Loading ? "Collapsed" : ""
        }`}
      >
        <div className="SignUp-container p-4 rounded">
          <form className="SignUp-form">
            <div className="logo" style={{display: 'inline', }}>
              <img
                src="../GDOCS.png"
                className="sheets-logo-icon1"
                alt="Sheets Logo"
              ></img>
            </div>
            <h2 className="mb-4">OTP Sent</h2>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Please Enter OTP:
              </label>
              <input
                type="text"
                value={otp}
                onChange={otpOnChange}
                className="form-control SignUpFormInput"
              />
            </div>
            <button
              type="button"
              onClick={SignUpHandler}
              className="btn btn-primary my-3 px-3" style={{width: '100%'}}
            >
              Sign Up
            </button>
            <div></div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OTP;
