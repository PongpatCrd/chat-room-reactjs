import React, { createContext, useReducer } from "react";
import { commonReducer } from "../../reducers/CommonReducer/CommonReducer";

export const CommonContext = createContext();

const init = {
    headerTitle: '',
    showLoginModal: false
  }

const CommonContextProvider = (props) => {
  const [common, dispatch] = useReducer(commonReducer, init);

  return (
    <CommonContext.Provider value={{ common, dispatch }}>
      {props.children}
    </CommonContext.Provider>
  );
};

export default CommonContextProvider;
