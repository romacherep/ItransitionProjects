import React from "react";
import 'materialize-css'
import './App.css';
import routes from './Routes/routes'
import useAuth from "./Hooks/authHook";
import {Context} from './context/Context'
function App() {
  const {token,login,logout,userId, ban} = useAuth()
  const isAuth = ((!!token) && !ban)
    {document.title = 'UserDbTable'}
  return (
      <Context.Provider value={{login,logout,userId,token, isAuth, ban}}>
        <div className="container">
          {routes(isAuth)}
        </div>
      </Context.Provider>
  );
}

export default App;
