import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Nav from "../Nav/Nav";

function SignOut() {
  const navigate = useNavigate(); // Initialize navigate function

  const handleclick1 = () => {
    navigate("/mainhome");
  };

  const handleclick2 = () => {
    navigate("/home-gm");
  };

  return (
    <div>
      <Nav />
      <h1>Sign Out</h1>
      <button onClick={handleclick1}>Stock Manager</button>
      <button onClick={handleclick2}>General Manager</button>
    </div>
  );
}

export default SignOut;
