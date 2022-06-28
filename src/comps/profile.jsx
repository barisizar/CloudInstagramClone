import "./profile.css";
import Topbar from "./topbar";
import { Users } from "../dummyData";
import { useState } from "react";
import React from "react";

export default function Profile() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  React.useEffect(() => {
    const name = localStorage.getItem("name");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    setName(name);
    setUsername(username);
    setEmail(email);
  }, []);
  return (
    <div classname="profile">
      <Topbar />
      <div classname="profile-container">
        <span classname="usern">Username: {username}</span>
        <br />
        <span classname="email">Email: {email}</span>
        <br />
        <span classname="name">Name: {name}</span>
        <br />
      </div>
    </div>
  );
}
