import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import React, { useState, useEffect } from 'react'
import AppContext from './AppContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginRoute from './components/Authentication';
import DefaultRoute from './components/DefaultRoute';
import HomeRoute from './components/HomeRoute';
import HistoryRoute from './components/HistoryRoute';
import GameRoute from './components/GameRoute';
import ViewGameRoute from './components/ViewGameRoute';
import ProfileRoute from './components/ProfileRoute';
import API from './API';
function App() {
  // stato per tenere traccia dello stato di autenticazione dell'utente
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  // controllo se l'utente è loggato
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        setLoggedIn(false);
        setUser(undefined);
      }
    }
    checkAuth();
  }, []);
  
 
  function loginSuccessful(user) {
    setUser(user);
    setLoggedIn(true);
  }

  async function doLogout() {
    await API.logout();
    setLoggedIn(false);
    setUser(undefined);
  }
  return (
    <BrowserRouter>
      <AppContext.Provider value={{
        loginState: {
          user: user,
          loggedIn: loggedIn,
          loginSuccessful: loginSuccessful,
          doLogout: doLogout
        }
      }}
      >
        <Routes>
          <Route path='/game' element={<GameRoute />} />
          <Route path='/viewgame/:gameid' element={<ViewGameRoute />} />
          <Route path='/login' element={<LoginRoute />} />
          <Route path='/' element={<HomeRoute />} />
          <Route path='/history' element={<HistoryRoute />} />
          <Route path='/profile' element={<ProfileRoute />} />
          <Route path='/*' element={<DefaultRoute />} />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App
