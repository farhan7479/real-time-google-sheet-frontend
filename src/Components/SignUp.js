import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const SignUp = () => {
  const baseURL = "https://sheets-backend-tdmn.onrender.com";
  const authtoken = localStorage.getItem("sheets-auth-token");
  const [name, setName] = useState("");
  const [Pass, setPass] = useState("");
  const Navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    if (authtoken) {
      Navigate(`/documents`);
    }
  }, []);
  const NameOnChange = (event) => {
    setName(event.target.value);
  };
  const EmailOnChange = (event) => {
    setEmail(event.target.value);
  };
  const PassOnChange = (event) => {
    setPass(event.target.value);
  };
  const SignUpHandler = async () => {
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !emailRegex.test(Email) || !Pass) {
      alert("Please enter all Details");
      setLoading(false);
    } else if (!(Pass.length >= 8)) {
      alert("Minimum Pass lenght is 8");
      setLoading(false);
    } else {
      const data = {
        name: name,
        pass: Pass,
        email: Email,
      };
      const url = `${baseURL}/api/auth/SignUp`;

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
      } else if (jsonData.success) {
        Navigate("/OTP", { state: { Email: Email } });
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
        <div className="SignUp-container p-5  rounded"style={{ maxWidth: "500px" }}>
          <form className="SignUp-form" >
            <div className="logo" style={{display: 'inline', }}>
             
            </div>
            <h2 className="mb-4">Sign Up</h2>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={NameOnChange}
                className="form-control SignUpFormInput"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Email:
              </label>
              <input
                type="email"
                value={Email}
                onChange={EmailOnChange}
                className="form-control SignUpFormInput"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                value={Pass}
                onChange={PassOnChange}
                className="form-control SignUpFormInput"
              />
            </div>
            <button
              type="button"
              style={{ width: "100%" }}
              onClick={SignUpHandler}
              className="btn btn-secondary my-3 px-3"
            >
              Sign Up
            </button>
            <div style={{ textAlign: "center" }}>
              <a href="/Login" style={{ textAlign: "center", color: "black" }}>
                Already have an account? Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
