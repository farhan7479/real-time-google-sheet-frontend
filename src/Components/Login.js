
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  const authtoken = localStorage.getItem('sheets-auth-token');
  const [Email, setEmail] = useState("");
  const [Loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const baseURL = "https://sheets-backend-tdmn.onrender.com";
  const [Pass, setPass] = useState("");
  useEffect(() => {
    if (authtoken) {
        Navigate('/');
    }
}, [])
  const EmailOnChange = (event) => {
    setEmail(event.target.value);
  }
  const PassOnChange = (event) => {
    setPass(event.target.value);
  }
  const LoginHandler = async () => {
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email) || !Pass) {
      alert("Please enter all Details");
      setLoading(false);
    }
    else if (!(Pass.length >= 8)) {
      alert("Minimum Pass lenght is 8");
      setLoading(false);
    }
    else {
      const data = {
        pass: Pass,
        email: Email,
      }
      const url = `${baseURL}api/auth/Login`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const jsonData = await response.json();
      console.log(jsonData);
      setLoading(false);
      if (jsonData.error) {
        alert(jsonData.error);
      }
      else if (jsonData.authtoken) {
        localStorage.setItem('sheets-auth-token', jsonData.authtoken);
        Navigate('/');
      }
      else {
      setLoading(false);
      alert("An issue occured, Pls report");
      }
    }
  }
  return (
    <>
      <div className={`SignUPMain container-fluid d-flex align-items-center justify-content-center ${Loading ? "" : "Collapsed"}`}>
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div className={`SignUPMain container-fluid d-flex align-items-center justify-content-center ${Loading ? "Collapsed" : ""}`}>
        <div className="SignUp-container p-4 rounded">
          <form className="SignUp-form">
            <h2 className="mb-4">Login</h2>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Email:</label>
              <input type="email" value={Email} onChange={EmailOnChange} className="form-control SignUpFormInput" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input type="password" value={Pass} onChange={PassOnChange} className="form-control SignUpFormInput" />
            </div>
            <button type="button" onClick={LoginHandler} className="btn btn-primary my-3 px-3">Login</button>
            <div>
              <a href='/Signup'>New? Signup</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
