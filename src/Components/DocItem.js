import React from 'react'
import NewPopup from './NewPopup'
import { useNavigate } from 'react-router-dom';

export default function DocItem(props) {
  const itemJSON = props.JSON;
  const navigate = useNavigate();
  return (
    <div className="DocItemDiv" onClick={() => (navigate(`../doc/${itemJSON._id}`))}>
      <span className="DocItemText">{itemJSON.title}</span>
    </div>
  )
}
