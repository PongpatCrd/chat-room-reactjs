export const actions = {
  SET_USER: "SET_USER",
  REMOVE_USER: "REMOVE_USER",
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return action.data;
    case actions.REMOVE_USER:
      return {};
    default:
      throw new Error();
  }
};
