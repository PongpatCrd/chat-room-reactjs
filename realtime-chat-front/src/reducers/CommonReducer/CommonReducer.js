export const actions = {
  SET_HEADER_TITLE: "SET_HEADER_TITLE",
  SET_SHOW_LOGIN_MODAL: "SET_SHOW_LOGIN_MODAL",
};

export const commonReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_HEADER_TITLE:
      return { ...state, headerTitle: action.data.headerTitle };
    case actions.SET_SHOW_LOGIN_MODAL:
      return { ...state, showLoginModal: action.data.showLoginModal};
    default:
      throw new Error();
  }
};
