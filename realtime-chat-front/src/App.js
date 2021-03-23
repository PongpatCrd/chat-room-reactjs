import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProtectRoute from "./helpers/ProtectRoute/ProtectRoute";

// parts
import Header from "./parts/Header/Header";
import Footer from "./parts/Footer/Footer";

// pages
import Landing from "./pages/Landing/Landing";
import ChatRoom from "./pages/ChatRoom/ChatRoom";
import History from "./pages/History/History";

import UserContextProvider from "./contexts/UserContext/UserContext";
import CommonContextProvider from "./contexts/CommonContext/CommonContext";

const App = () => {
  return (
    <UserContextProvider>
      <CommonContextProvider>
        <Router>
          <div className="header">
            <Header></Header>
          </div>

          <div className="content" style={{ margin: "40px" }}>
            <Route path="/" exact component={Landing} />
            <ProtectRoute path="/rooms" exact component={ChatRoom} />
            <ProtectRoute path="/history" exact component={History} />
          </div>

          <div className="footer">
            <Footer></Footer>
          </div>
        </Router>
      </CommonContextProvider>
    </UserContextProvider>
  );
};

export default App;
