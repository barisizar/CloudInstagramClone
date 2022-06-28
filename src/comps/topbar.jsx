import "./topbar.css";
import { Search } from "@material-ui/icons";
import pfp from "../tempasset/1.jpeg";
import { useHistory } from "react-router-dom";

export default function Topbar() {
  let history = useHistory();
  const logOut = () => {
    localStorage.clear();
    history.push("/");
  };
  const goProfile = () => {
    console.log("go profile");
    history.push("/Profile");
  };
  const goMain = () => {
    console.log("go profile");
    history.push("/Feed");
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo" onClick={goMain}>
          Serverless
        </span>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="What post would you like to see?"
            className="searchInput"
          />
        </div>
      </div>
      <div>
        <button onClick={logOut}>Logout</button>
      </div>
      <div className="topbarRight">
        <img src={pfp} alt="" className="topbarImg" onClick={goProfile} />
      </div>
    </div>
  );
}
