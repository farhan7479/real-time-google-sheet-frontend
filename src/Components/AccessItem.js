import React, { useEffect, useState } from "react";

export default function AccessItem(props) {
  const { requestData, DocID } = props;
  const [selectedAccess, setSelectedAccess] = useState("private");
  const [userInfo, setUserInfo] = useState(null);
  const authtoken = localStorage.getItem("sheets-auth-token");
  const baseURL = "https://sheets-backend-tdmn.onrender.com";

  const handleAccessChange = async (event) => {
    const newSelectedAccess = event.target.value;
    setSelectedAccess(event.target.value);
    const userIdToAdd = requestData;

    try {
      const documentId = DocID; 

      if (newSelectedAccess === "edit") {
        event.target.disabled = true;
        const response = await fetch(`${baseURL}/api/document/AddEditor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authtoken,
          },
          body: JSON.stringify({ documentId, userIdToAdd }),
        });

        if (response.ok) {
          console.log("User added as editor successfully");
        } else {
          console.error("Failed to add user as editor");
        }
        event.target.disabled = false;
      } else if (newSelectedAccess === "view") {
        event.target.disabled = true;
        const response = await fetch(`${baseURL}/api/document/AddViewer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authtoken,
          },
          body: JSON.stringify({ documentId, userIdToAdd }),
        });

        if (response.ok) {
          console.log("User added as viewer successfully");
        } else {
          console.error("Failed to add user as viewer");
        }
        event.target.disabled = false;
      }
    } catch (error) {
      console.error("Error handling access change:", error);
    }
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `${baseURL}/api/auth/userInfo`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "user-id": requestData,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error("Failed to fetch user information");
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
  }, [requestData.id]);
  return (
    <div className="person">
      <span className="name">{userInfo?.name}</span>
      <select
        id="access-dropdown"
        value={selectedAccess}
        onChange={handleAccessChange}
        className="dropdown-select"
      >
        <option value="edit">Edit Permissions</option>
        <option value="view">View Permissions</option>
        <option value="private"> No Permissions</option>
      </select>
    </div>
  );
}
