import dayjs from 'dayjs';

const URL = 'http://localhost:3001/api';


function getUsers() {
    // call GET /api/users
    return new Promise((resolve, reject) => {
      fetch(URL + '/users', {
          credentials: 'include'
      })
      .then(response => {
          if(response.ok){
              response.json()
              .then(users => { resolve(users); });
          } else {
              // analyze the cause of error
              response.json()
              .then(message => { reject(message); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  } 
  
  async function login(credentials) {
    // call POST /api/sessions
    let response = await fetch(URL + '/sessions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
    
  async function logout() {
    // call DELETE /api/sessions/current
    await fetch(URL + '/sessions/current', {
      method: 'DELETE', 
      credentials: 'include' 
    });
  }
  
  async function getUserInfo() {
    // call GET /api/sessions/current
    const response = await fetch(URL + '/sessions/current', {
      credentials: 'include'
    });
      
    const userInfo = await response.json();
    if (response.ok) {
       return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
  }


  function getMemeImages() {
    // call GET /api/images
    return new Promise((resolve, reject) => {
      fetch(URL + '/images', {
      })
      .then(response => {
          if(response.ok){
              response.json()
              .then(images => { resolve(images); });
          } else {
              // analyze the cause of error
              response.json()
              .then(message => { reject(message); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }
  function getCaptions(memeid){
    return new Promise((resolve, reject) => {
      fetch(URL + '/captions/'+memeid, {
      })
      .then(response => {
          if(response.ok){
              response.json()
              .then(captions => { resolve(captions); });
          } else {
              // analyze the cause of error
              response.json()
              .then(message => { reject(message); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }
  //funzione salvataggio partita solo accessibile da utenti loggati
  function saveGame(score, date,listmeme) {
    // TO DO FIX THIS
    console.log("sto salvando la partita");
    console.log(score);
    return new Promise((resolve, reject) => {
      fetch(URL + '/savegame', {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ score: score, date: date,listmeme: listmeme }), // Stringify the entire object
      })
        .then(response => {
          if (response.ok) {
            response.json()
              .then(game => { resolve(true); })
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // Handle JSON parsing error
          } else if (response.status === 404) {
            reject({ error: "Endpoint not found" });
          } else {
            // analyze the cause of error
            response.json()
              .then(message => { reject(message); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }

function getGames() {
    // call GET /api/games
    return new Promise((resolve, reject) => {
      fetch(URL + '/games', {
          credentials: 'include'
      })
      .then(response => {
          if(response.ok){
              response.json()
              .then(games => { resolve(games); });
          } else {
              // analyze the cause of error
              response.json()
              .then(message => { reject(message); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }
function getGame(gameId) {
    return new Promise((resolve, reject) => {
      fetch(URL + '/games/'+gameId, {
          credentials: 'include'
      })
      .then(response => {
        console.log(response);
          if(response.ok){
              response.json()
              .then(game => { resolve(game); });
          } else {
              // analyze the cause of error
              response.json()
              .then(message => { reject(message); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }
  
const API = {getUsers, login, logout, getUserInfo,getMemeImages,getCaptions,saveGame,getGames,getGame};
  
export default API;