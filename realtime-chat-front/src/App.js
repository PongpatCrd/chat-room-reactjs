import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./parts/Header/Header";
import Footer from "./parts/Footer/Footer";
import Landing from "./pages/Landing/Landing";

import UserContextProvider from "./contexts/UserContext/UserContext";

const App = () => {
  return (
    <div>
      <UserContextProvider>
        <div className="header">
          <Router>
            <Route
              path="/"
              exact
              component={() => <Header title="Join"></Header>}
            />
            <Route
              path="/rooms"
              exact
              component={() => <Header title="Rooms"></Header>}
            />
            <Route
              path="/login"
              exact
              component={() => <Header title="Login"></Header>}
            />
          </Router>
        </div>

        <div className="content" style={{ margin: "40px" }}>
          <Router>
            <Route path="/" exact component={Landing} />
            {/* <Route path="/chat" component={Chat} /> */}
          </Router>
        </div>

        <div className="footer">
          <Footer></Footer>
        </div>
      </UserContextProvider>
    </div>
  );
};

export default App;
