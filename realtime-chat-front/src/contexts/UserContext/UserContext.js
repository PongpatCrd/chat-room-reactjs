import React, { createContext, useReducer } from "react";
import { userReducer } from "../../reducers/UserReducer/UserReducer";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  /*
    context format
    {
      username: str,
      displayName: str,
      lastOnlineAt: str,
      accessToken: str
    }
  */
  const ls = localStorage.getItem("user");
  const init = ls ? JSON.parse(ls) : {};

  const [user, dispatch] = useReducer(userReducer, init);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
