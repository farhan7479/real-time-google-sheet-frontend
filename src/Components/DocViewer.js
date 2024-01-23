import React, { useEffect, useState } from "react";
import NavbarCopy from "./NavbarCopy";
import DocItem from "./DocItem";
import { useNavigate } from "react-router-dom";

export default function DocViewer() {
  const baseURL = "https://sheets-backend-tdmn.onrender.com";
  const [Docs, setDocs] = useState([]);
  const authtoken = localStorage.getItem("sheets-auth-token");
  const Navigate = useNavigate();
  useEffect(() => {
    if (!authtoken) {
      Navigate("/");
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${baseURL}/api/document/GetAll`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authtoken,
          },
        });
        const jsonData = await response.json();
        setDocs(jsonData);
        console.log(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <NavbarCopy />
      <div className="DocListDiv">
        <div className="DocListHeading">
          <b>Current Documents:</b>
        </div>
        {Docs.map((doc) => (
          <DocItem
            JSON={doc}
          />
        ))}
      </div>
    </div>
  );
}
