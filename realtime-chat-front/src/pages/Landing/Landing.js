import React, { useContext, useEffect } from "react";
import { CommonContext } from "../../contexts/CommonContext/CommonContext";

const Landing = (props) => {
  const { common, dispatch: commonDispatch } = useContext(CommonContext);

  useEffect(() => {
    commonDispatch({ type: "SET_HEADER_TITLE", data: { headerTitle: "Home" } });

    if (props.showLoginModal) {
      commonDispatch({ type: "SET_SHOW_LOGIN_MODAL", data: { showLoginModal: props.showLoginModal } });
    }
  }, []);

  return <div>landing</div>;
};

export default Landing;
