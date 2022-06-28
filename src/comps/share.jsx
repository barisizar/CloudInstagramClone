import "./share.css";
import { PermMedia } from "@material-ui/icons";
import pfp from "../tempasset/1.jpeg";
import { useState } from "react";
import * as React from "react";
import axios from "axios";

export default function Share() {
  const [shareInput, setShareInput] = useState("");
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [images, setImages] = useState([]);
  const uploadPhotoUrl =
    "https://yh90v4rj52.execute-api.us-east-2.amazonaws.com/prod/uploadPhoto";

  async function postImage({ image, shareInput }) {
    const formData = new FormData();
    formData.append("filePath", image);
    formData.append("fileName", shareInput);
    console.log("filename", fileName);
    console.log("share Input", shareInput);
    console.log("image", image);

    axios
      .post(uploadPhotoUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": "FQt5h1zCxz5te2tLTwAAI6ewbvzgXwdlg7Svx5c1",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // var resp = response.body;
          console.log("Succesfull");
        }
      })
      .catch((error) => {
        // if (error.response.status === 401) {
        //   console.log(error.response.data.message);
        // } else {
        console.log("error");
        // }
      });
  }
  const submit = async (event) => {
    event.preventDefault();
    postImage({ image: file, shareInput });
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };
  const showFile = (event) => {
    event.preventDefault();
    console.log("filename", fileName);
    console.log("share Input", shareInput);
    console.log("image", event.image);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={pfp} alt="" />
          <input
            placeholder="What'the Filename"
            className="shareInput"
            onChange={(event) => {
              setFileName(event.target.value);
            }}
          />
          <input
            placeholder="What's in your mind?"
            className="shareInput"
            onChange={(event) => {
              setShareInput(event.target.value);
            }}
          />
        </div>
        <div className="shareBottom">
          <div className="shareOptions">
            <div className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <input
                onChange={fileSelected}
                type="file"
                accept="image/*"
              ></input>
            </div>
          </div>
        </div>
        <button type="button" onClick={submit}>
          Submit
        </button>
      </div>
    </div>
  );
}
