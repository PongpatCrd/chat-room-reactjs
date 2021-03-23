import React, { useContext } from "react";
import { Route } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext/UserContext";
import Landing from "../../pages/Landing/Landing";

const ProtectRoute = ({ component: Component, ...rest }) => {
  const { user, dispatch } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (Object.keys(user).length > 0) {
          return <Component {...rest} {...props} />;
        } else {
          return <Landing showLoginModal={true}></Landing>;
        }
      }}
    />
  );
};

export default ProtectRoute;
