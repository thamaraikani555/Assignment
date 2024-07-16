import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { makeNewLink } from "../store/slices/authSlice";
import { useNavigate  } from 'react-router-dom';

function GenerateLink() {
   
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [link, setLink] = useState('');

  
  const handleGenerateLink = async (e) => {
    e.preventDefault();
    dispatch( makeNewLink({userName}, navigate));
  };

  return (
    <div>
      <h2>Generate One-Time Link</h2>
      <form onSubmit={handleGenerateLink}>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Username" />
        <button type="submit">Generate Link</button>
      </form>
      <p>{link}</p>
    </div>
  );
}

export default GenerateLink;
