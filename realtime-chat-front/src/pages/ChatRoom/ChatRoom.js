import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { CommonContext } from "../../contexts/CommonContext/CommonContext";

const ChatRoom = () => {
  const { user } = useContext(UserContext);
  const { common, dispatch: commonDispatch } = useContext(CommonContext);

  useEffect(() => {
    commonDispatch({
      type: "SET_HEADER_TITLE",
      data: { headerTitle: "Rooms" },
    });
  }, []);

  return <div>ChatRoom</div>;
};

export default ChatRoom;
