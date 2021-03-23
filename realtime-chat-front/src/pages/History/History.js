import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { CommonContext } from "../../contexts/CommonContext/CommonContext";

const History = () => {
  const { user } = useContext(UserContext);
  const { common, dispatch: commonDispatch } = useContext(CommonContext);

  useEffect(() => {
    commonDispatch({
      type: "SET_HEADER_TITLE",
      data: { headerTitle: "History" },
    });
  }, []);

  return <div>History</div>;
};

export default History;
