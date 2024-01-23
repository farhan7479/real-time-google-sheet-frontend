import React, { useState } from 'react';
import SharePopup from './SharePopup'
import { useNavigate } from 'react-router-dom';

export default function Navbar(props) {
  const {title, DocID, edit} = props;
  const authtoken = localStorage.getItem("sheets-auth-token");
  const [Sharepopupv, setPopup] = useState(false);
  const navigate = useNavigate();
  const baseURL = "https://sheets-backend-tdmn.onrender.com";
  const Logout = () => {
    localStorage.removeItem("sheets-auth-token");
    navigate("/");

  }
  const SendRequest = async () => {
    try {

      const response = await fetch(`${baseURL}/api/document/RequestAccess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": authtoken,
        },
        body: JSON.stringify({
          documentId: DocID,
        }),
      });

      if (response.ok) {
        console.log('Access request submitted successfully');
      } else {
        const responseData = await response.json();
        console.error('Error submitting access request:', responseData.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div>
      <SharePopup Sharepopupv={Sharepopupv} setPopup={setPopup} DocID={DocID} title={title}/>
      <nav className="navbar">
      <div className="logo">
        <img src='../GDOCS.png' className="sheets-logo-icon" alt="Sheets Logo"></img>
      </div>
      <div className="workspace-title">
        <h1 style={{ fontSize: '18px', marginTop: '6px' }}>Sheets</h1>
        <span className="sheet-info">{title}</span>
      </div>
      <div className="action-buttons">
        <div className="share-logout">
          <button className={`share-button ${edit?(""):("Collapsed")}`} onClick={() => (setPopup(true))}>Share</button>
          <button className={`share-button ${edit?("Collapsed"):("")}`} onClick={() => SendRequest()}>Send Access Request</button>
          <a href="#" className="logout-button" onClick={() => Logout()}>Log Out</a>
        </div>
      </div>
    </nav>
    </div>
  );
}
