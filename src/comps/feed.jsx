import Post from "./post";
import Share from "./share";
import "./feed.css";
import Topbar from "./topbar";
import { Posts } from "../dummyData";

export default function Feed() {
  return (
    <div className="feed">
        <Topbar />
      <div className="feedWrapper">
        <Share />
        {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}