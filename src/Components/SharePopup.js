import React, { useEffect, useState } from "react";
import AccessItem from "./AccessItem";

export default function SharePopup(props) {
  const { Sharepopupv, setPopup, DocID, title } = props;
  const authtoken = localStorage.getItem("sheets-auth-token");
  const baseURL = "https://sheets-backend-tdmn.onrender.com";
  const publicURL = "https://sheets-theta.vercel.app";
  const [accessRequests, setAccessRequests] = useState([]);
  useEffect(() => {
    // Fetch access requests when the component mounts
    const fetchAccessRequests = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/document/GetRequests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": authtoken,
              documentId: DocID,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAccessRequests(data.requests);
        } else {
          console.error("Failed to fetch access requests");
        }
      } catch (error) {
        console.error("Error fetching access requests:", error);
      }
    };

    if (Sharepopupv) {
      fetchAccessRequests();
    }
  }, [Sharepopupv, DocID, authtoken]);

  const [selectedAccess, setSelectedAccess] = useState("edit");

  const handleAccessChange = (event) => {
    setSelectedAccess(event.target.value);
  };

  const handleSaveAccess = async () => {
    try {
      const response = await fetch(
        `${baseURL}/api/document/ChangeViewMode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authtoken,
          },
          body: JSON.stringify({
            viewMode: selectedAccess,
            documentId: DocID,
          }),
        }
      );

      if (response.ok) {
        console.log("View mode updated successfully");
      } else {
        console.error("Failed to update view mode");
      }
      setPopup(false);
    } catch (error) {
      console.error("Error updating view mode:", error);
      alert("An Error Occured");
    }
  };

  return (
    <div id="share-popup" className={Sharepopupv ? "" : "Collapsed"}>
      <div className="header">
        <span className="title">Share "{title}"</span>
        <button className="close-button" onClick={() => setPopup(false)}>
          ×
        </button>
      </div>
      <div className="content">
        <div className="people-section">
          <span className="label">Access Requests</span>
          <div className="people-list">
            {accessRequests.map((request, index) => (
              <AccessItem key={index} requestData={request} DocID={DocID}/>
            ))}
          </div>
        </div>
        <div className="access-section">
          <span className="label">General access</span>
          <div className="dropdown dropdown-container">
            <label htmlFor="access-dropdown">Select access:</label>
            <select
              id="access-dropdown"
              value={selectedAccess}
              onChange={handleAccessChange}
              className="dropdown-select"
            >
              <option value="edit">Anyone with the link can edit</option>
              <option value="view">Anyone with the link can view</option>
              <option value="private">
                Only people with access can open with the link
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="link-section">
        <span class="link-label">Link:</span>
        <input
          type="text"
          class="link-field"
          disabled
          value={`${publicURL}/doc/${DocID}`}
        />
        <button
          class="copy-button"
          onClick={() =>
            navigator.clipboard.writeText(`${publicURL}/doc/${DocID}`)
          }
        >
          Copy link
        </button>
      </div>
      <div className="footer">
        <button className="done-button" onClick={handleSaveAccess}>
          Save Access
        </button>
      </div>
    </div>
  );
}
