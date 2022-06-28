import Home from "./pages/home";
import Topbar from "./comps/topbar";
import Feed from "./comps/feed";
import Profile from "./comps/profile";
import * as React from "react";
import {
  useHistory,
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Routes */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/Feed">
            <Feed></Feed>
          </Route>
          <Route exact path="/Profile">
            <Profile></Profile>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
