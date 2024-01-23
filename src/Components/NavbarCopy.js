import React, { useState } from 'react';
import NewPopup from "./NewPopup";

export default function NavbarCopy() {
  const [popup, setPopup] = useState(false);
  return (
    <>
    <NewPopup setPopup={setPopup} popup={popup}/>
    <nav className="navbar">
      <div className="logo">
        <img src='../GDOCS.png' className="sheets-logo-icon" alt="Sheets Logo"></img>
      </div>
      <div className="workspace-title">
        <h1 style={{ fontSize: '18px', marginTop: '6px' }}>Sheets</h1>
      </div>
      <div className="action-buttons">
        <div className="share-logout">
          <button className="share-button" onClick={() => (setPopup(true))}>New</button>
        </div>
      </div>
    </nav>
    </>
  );
}
