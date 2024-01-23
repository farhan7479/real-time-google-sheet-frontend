import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as UUID } from 'uuid';

export default function NewPopup(props) {
  const {popup, setPopup} = props;
  const [Title, setTitle] = useState("Untitled Document");
  return (
    <div id="title-popup" className={popup?(""):("Collapsed")}>
      <div class="header">
        <span class="title">Create new Document</span>
        <button class="close-button" onClick={() => (setPopup(false))}>×</button>
      </div>
      <div class="content">
        <div class="access-section">
          <div class="link-section">
            <span class="link-label">Title:</span>
            <input type="text" value={Title} onChange={(e) => (setTitle(e.target.value))} class="link-field1"/>
          </div>
        </div>
      </div>
      <div class="footer">
        <Link to={`../doc/${UUID()}`} state={{title: Title}} class="done-button">Create</Link>
      </div>
    </div>
  );
}
