import React, { useReducer } from "react";

export default (reducer, action, initialState) => {
  const Context = React.createContext();

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const recieveActions = {};

    for (key in action) {
      recieveActions[key] = action[key](dispatch);
    }

    return (
      <Context.Provider value={{ state, ...recieveActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};
