'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import dao from './dao.js';
import userDao from './user-dao.js'; // Aggiungi questa riga per importare userDao correttamente

/*** Set up Passport ***/
// set up the "username and password" login strategy
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Wrong username and/or password.' });

      return done(null, user);
    }).catch(err => done(err));
  }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

// set-up middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your client's origin
  credentials: true
};
app.use(cors(corsOptions));

// set up the session
app.use(session({
  secret: 'wge8d239bwd93rkskb',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    httpOnly: true,
    sameSite: 'lax' // set the sameSite attribute correctly
  }
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
}

/*** User APIs ***/

// POST /api/sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    console.log('POST /api/sessions', user);
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /api/sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});

// GET /api/sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });
});

/*** Immagini e didascalie APIs ***/

// GET /api/images, funzione che fa richiesta al DAO per ottenere i nomi delle immagini disponibili ( di conseguenza gli url delle immagini)
app.get('/api/images', async (req, res) => {
  dao.getImages()
    .then(images => res.json(images))
    .catch(() => res.status(500).end());
});
// GET /api/captions/:memeid, funzione che fa richiesta al DAO per ottenere le didascalie per un meme specifico
app.get('/api/captions/:memeid', async (req, res) => {
  dao.getCaptions(req.params.memeid).
    then(captions => res.json(captions))
    .catch(() => res.status(500).end());
});

/*** Gioco  APIs, disponibili solo per utente loggati ***/

// POST /api/savegame, funzione che salva una partita nel database, richiede il punteggio, la data e la lista di meme usati e dopo oppurtuna validazione salva la partita disponibile solo per utenti autenticati
app.post('/api/savegame', isLoggedIn,[
  check('score').isString(),
  check('date').isISO8601(),
  check('listmeme').isString()
],async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
  }
  const score = req.body.score;
  const date = req.body.date;
  const listmeme = req.body.listmeme;
  // Check if the required data is present and valid
  if (!score || !date || !listmeme) {
    res.status(422).end();
    return;
  }
  // Save the game
  dao.saveGame(req.user.id, score, date, listmeme)
    .then(game => res.json(null))
    .catch(() => res.status(500).end());
});

// GET /api/games, funzione che fa richiesta al DAO per ottenere le partite salvate da un utente isponibile solo per utenti autenticati
app.get('/api/games', isLoggedIn,async (req, res) => {
  dao.getGames(req.user.id)
    .then(games => res.json(games))
    .catch(() => res.status(500).end());
});

// GET /api/games/:id, funzione che fa richiesta al DAO per ottenere una partita salvata da un utente isponibile solo per utenti autenticati
app.get('/api/games/:id', isLoggedIn, (req, res) => { 
  dao.getGame(req.params.id, req.user.id)
    .then(game => res.json(game))
    .catch(() => res.status(500).end());
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
