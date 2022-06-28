import React from "react";
import "./home.css";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
const registerUrlHealth =
  "https://yh90v4rj52.execute-api.us-east-2.amazonaws.com/prod/health";

const registerUrlRegister =
  "https://yh90v4rj52.execute-api.us-east-2.amazonaws.com/prod/register";

const registerUrlLogin =
  "https://yh90v4rj52.execute-api.us-east-2.amazonaws.com/prod/login";

export default function Home() {
  let history = useHistory();
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Feed");
    }
  }, []);
  const [name, setName] = useState("name");
  const [username, setUsername] = useState("username");
  const [email, setEmail] = useState("email@email");
  const [password, setPassword] = useState("password");
  const [message, setMessage] = useState("");

  const health = () => {
    const requestConfig = {
      headers: {
        "x-api-key": "FQt5h1zCxz5te2tLTwAAI6ewbvzgXwdlg7Svx5c1",
      },
    };
    axios
      .get(registerUrlHealth, requestConfig)
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => {
        // if (error.response.status === 401) {
        //   console.log(error.response.data.message);
        // } else {
        setMessage("error");
        console.log(error);
        // }
      });
  };

  const loginUser = (event) => {
    event.preventDefault();
    if (username.trim() === "" || email.trim() === "") {
      console.log("All fields are required");
      return;
    }
    const requestConfig = {
      headers: {
        "x-api-key": "FQt5h1zCxz5te2tLTwAAI6ewbvzgXwdlg7Svx5c1",
      },
    };
    console.log(JSON.stringify("username: "), JSON.stringify(username));
    console.log(JSON.stringify(username));
    const requestBody = {
      username: username,
      password: password,
    };
    axios
      .post(registerUrlLogin, requestBody, requestConfig)
      .then((response) => {
        if (response.status === 200) {
          var token = response.data.token;
          localStorage.setItem("token", token);
          localStorage.setItem("username", username);
          localStorage.setItem("name", name);
          localStorage.setItem("email", email);
          history.push("/Feed");
        }
      })
      .catch((error) => {
        // if (error.response.status === 401) {
        //   console.log(error.response.data.message);
        // } else {
        setMessage("error");
        console.log(error);
        // }
      });
  };
  const addUser = (event) => {
    event.preventDefault();
    if (
      username.trim() === "" ||
      email.trim() === "" ||
      name.trim() === "" ||
      password.trim() === ""
    ) {
      console.log("All fields are required");
      return;
    }
    const requestConfig = {
      headers: {
        "x-api-key": "FQt5h1zCxz5te2tLTwAAI6ewbvzgXwdlg7Svx5c1",
      },
    };
    console.log("username: ", username);
    console.log("name: ", name);
    console.log("email: ", email);
    console.log("password: ", password);
    const requestBody = {
      name: name,
      email: email,
      username: username,
      password: password,
    };
    axios
      .post(registerUrlRegister, requestBody, requestConfig)
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => {
        // if (error.response.status === 401) {
        //   console.log(error.response.data.message);
        // } else {
        setMessage("error");
        console.log(error);
        // }
      });
  };

  return (
    <div class="fp">
      <section class="fp-top">
        <section class="header">
          <span class="hname">Serverless</span>
          <div class="login">
            <label class="username">
              <span>Username</span>
              <input
                type="text"
                class="username"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </label>
            <label class="pw">
              <span>Password</span>
              <input
                type="password"
                class="pw"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </label>
            <button onClick={loginUser}>Log In</button>
          </div>
        </section>
      </section>
      <section class="fp-main">
        <section class="body">
          <section class="fp-main-left">
            <p>
              Join Today! Serverless Media is where you can connect with all
              your friends and family!
            </p>
            <div class="fp-icons">
              <li>
                <div class="fp-left-text">
                  <span class="bold">
                    See photos and updates
                    <span>from friends in News Feed.</span>
                  </span>
                </div>
              </li>
              <li>
                <div class="fp-left-text">
                  <span class="bold">
                    Share what's new<span>in your life on your Timeline.</span>
                  </span>
                </div>
              </li>
              <li>
                <div class="fp-left-text">
                  <span class="bold">
                    Find more
                    <span>
                      of what you're looking for with Serverless Search.
                    </span>
                  </span>
                </div>
              </li>
            </div>
          </section>
          <section class="fp-main-right">
            <section class="fplmh">
              <p>Sign Up</p>
              <p>It's quick and easy.</p>
            </section>
            <div class="signup">
              <div class="sfname">
                <label>
                  <input
                    type="text"
                    placeholder="name"
                    class="fname"
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                </label>
                <label>
                  <input
                    type="text"
                    placeholder="username"
                    class="lname"
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                </label>
              </div>
              <label class="sfemail">
                <input
                  type="text"
                  placeholder="Email"
                  class="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </label>
              <label class="sfpw">
                <input
                  type="password"
                  placeholder="New password"
                  class="pw"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </label>
              <p class="tac">
                By clicking Sign Up, you agree to our <span>Terms</span>,{" "}
                <span>Data Policy</span> and
                <span>Cookies Policy</span>. You may receive SMS Notifications
                from us and can opt out any time.
              </p>
              <button class="btn-s" onClick={addUser}>
                Sign Up
              </button>
              {message && <p className="message">{message}</p>}
            </div>
            <div class="demo-btn-div">
              <button onClick={health}>Demo Login</button>
            </div>
          </section>
        </section>
      </section>
      <section class="fp-footer">
        <section class="bottom">
          <span>Sign Up</span>
          <span>Log In</span>
          <span>About</span>
          <span>Privacy</span>
          <span>Cookies</span>
          <span>Terms</span>
          <span>Help</span>
        </section>
        <span class="lkc">Serverless 2021</span>
      </section>
    </div>
  );
}
