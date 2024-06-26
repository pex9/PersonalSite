[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/J0Dv0VMM)
# Exam #1: "GIOCO DI MEME"
## Student: s323013 PELLEGINO DAVIDE

## React Client Application Routes

- Route `/`: pagina principale, rappresenta il L'inizio del gioco con la possibilita di loggarsi nella top bar, accessibile da qualsiasi utente
- Route `/history`: pagina dedicata per accedere allo storico delle partite di un utente,accessibile solo dagli utenti autenticati
- Route `/viewgame/:gameid`: pagina dedicata all'accesso a una partita dell'utente nel suo storico, accessibile da utente autenticati
- Route `/game/`: pagina dedicata alla partita dell'utente, accessibile da qualsiasi utente
- Route `/login`:  pagina contenente il form per l'autenticazione
- Route `/*`: default route per le route inesistenti (contiene pulsante per ritornare alla pagina principale)

## API Server

### Autenticazione

- POST `/api/sessions`
  - Descrizione: Non autenticata, crea una nuova sessione
  - Request: il body contiene un oggetto con all'interno le credenziali per l'autenticazione (Content-Type: `application/json`)
  ```
  {
      "username": "mario@test.it",
      "password": "pwd"
  }
  ```
  - Response: restituisce `200 OK` (successo), `401 Unauthorized` (credenziali errate) o `500 Internal Server Error` (errore generico). In caso di successo il body contiente un oggetto con all'interno le informazioni dell'utente autenticato (Content-Type: `application/json`) 
- DELETE `/api/sessions/current`
  - Descrizione: Autenticata, elimina la sessione corrente
  - Request: Nessun body
  - Response: restituisce `200 OK` (successo), `401 Unauthorized` (utente non autenticato) o `500 Internal Server Error` (errore generico). Nessun body
- GET `/api/sessions/current`
  - Descrizione: Autenticata, verifica che la sessione corrente è ancora valida e restituisce le informazioni dell'utente autenticato
  - Request: Nessun body
  - Response: restituisce `200 OK` (successo) o `401 Unauthorized` (utente non autenticato). In caso di successo il body contiente un oggetto con all'interno le informazioni dell'utente associato alla sessione corrente (Content-Type: `application/json`)
  ```
  {
      "id": 2,
      "username": "mario@test.it",
      "name": "Mario",
  }
  ```
### API restanti

- GET `/api/images`
  - Descrizione: Restituisce le immagini disponibili per il gioco
  - Request: Nessun body
  - Response: restituisce `200 OK` (successo) o `500 Internal Server Error` (errore generico). In caso di successo il body contiene un array di oggetti con le informazioni delle immagini disponibili (Content-Type: `application/json`)
  ```json
  [
      {
          "id": 1,
          "image_url": "meme1.jpg"
      },
      {
          "id": 2,
          "image_url": "meme2.jpg"
      }
  ]
  ```

- GET `/api/captions/:memeid`
  - Descrizione: Restituisce le didascalie associate a un meme specifico
  - Request: Nessun body, è presente il parametro `memeid` che rappresenta l'id del meme in cui sono richieste le didascalie
  - Response: restituisce `200 OK` (successo) o `500 Internal Server Error` (errore generico). In caso di successo il body contiene un array di oggetti con le informazioni delle didascalie associate al meme (Content-Type: `application/json`)
  ```json
  [
      {
          "id": 1,
          "meme_id": 1,
          "text": "xxx..."
      },
      {
          "id": 2,
          "meme_id": 1,
          "text": "xxx..."
      }
  ]
  ```

- POST `/api/savegame`
  - Descrizione: Autenticata,Salva una partita nel database
  - Request: il body contiene le informazioni della partita da salvare (Content-Type: `application/json`)
  ```json
  {
      "score": "5,0,0",
      "date": "2024-06-20",
      "listmeme": "meme1.jpg,meme2.jpg,meme3.jpg"
  }
  ```
  - Response: restituisce `200 OK` (successo), `400 Bad Request` (dati mancanti o non validi), `401 Unauthorized` (utente non autenticato) o `500 Internal Server Error` (errore generico). In caso di successo il body è vuoto.

- GET `/api/games`
  - Descrizione: Autenticata,Restituisce le partite salvate dall'utente
  - Request: Nessun body
  - Response: restituisce `200 OK` (successo) o `500 Internal Server Error` (errore generico). In caso di successo il body contiene un array di oggetti con le informazioni delle partite salvate dall'utente (Content-Type: `application/json`)
  ```json
  [
      {
          "id": 1,
          "user_id": 1,
          "score": "5,0,5",
          "created_at": "2024-06-20"
      },
      {
          "id": 2,
          "user_id": 1,
          "score": "5,5,5",
          "created_at": "2024-06-20"
      }
  ]
  ```

- GET `/api/games/:id`
  - Descrizione: Autenticata,Restituisce una partita salvata dall'utente
  - Request: Nessun body,è presente il parametro `id` che rappresenta l'id del partita che si deve ritornare
  - Response: restituisce `200 OK` (successo) o `500 Internal Server Error` (errore generico). In caso di successo il body contiene un oggetto con le informazioni della partita salvata dall'utente (Content-Type: `application/json`)
  ```json
  {
      "id": 1,
      "user_id": 1,
      "score": "5,0,5",
      "created_at": "2024-06-20"
  }
  ```

## Database Tables

- Table `users` : (id, name, email, hash, salt, admin)
  - Tabella utilizzata per memorizzare le informazioni degli utenti
- Table `partite`: (id, user_id, score, created_at)
  - Tabella utilizzata per memorizzare le partite giocate dagli utenti.
  - `id`: ID della partita.
  - `user_id`: ID dell'utente che ha giocato la partita (foreign key da `users`).
  - `score`: Punteggii di un ogni round separati da virgola ottenuti nella partita.
  - `listmeme`: Nomi dei meme presenti in partita separati da virgola ottenuti nella partita.
  - `created_at`: Data e ora di inizio della partita.
- Table `meme`: (id, image_url)
  - Tabella utilizzata per memorizzare i meme disponibili per il gioco dove le immagini sono rese disponibili dal server pubblicamente nella directory public.
  - `id`: ID del meme.
  - `image_url`: Nome dell'immagine del meme.
- Table `didascalie`: (id, meme_id, text)
  - Tabella utilizzata per memorizzare le didascalie associate ai meme(una meme ha almeno 2 didascalie associate come da progetto).
  - `id`: ID della didascalia.
  - `meme_id`: ID del meme associato (foreign key da `memes`).
  - `text`: Testo della didascalia.

## Main React Components

- `MyNavbar` (in `Navbar.jsx`): rappresenta la Navbar che viene mostrata in ogni schermata, contiene il nome del sito e la possibilita di fare il login, se loggato vi è la possibilita di accedere alla pagina profilo di quel utente
- `DefaultRoute` (in `DefaultRoute.jsx`): rappresenta la default route, contiene un pulsante per ritornare alla schermata principale 
- `MyMain` (in `Main.jsx`): componente utilizzato per presentare le regole all'utente con la possibilita di iniziare una partita  
- `LoginRoute` (in `Authentication.jsx`): rappresenta la schermata contenente il form per l'autenticazione
- `HistoryRoute` (in `HistoryRoute.jsx`): rappresenta la schermata contenente lo storico delle partite fatte dall'utente con data e punteggio 
- `GameRoute` (in `GameRoute.jsx`): rappresenta la schermata di gioco con la possibita di selezionare un didascalia adatta all'immagine e riepilogo
- `HistoryRoute` (in `HistoryRoute.jsx`): rappresenta la generale dello storico delle partite dell'utente con la possibilita di visualizzare in dettaglio una partita.
- `ViewGameRoute` (in `ViewGameRoute.jsx`): rappresenta la schermata riferita a una partita dello storico con dettagli di meme e punteggi associati.
- `ProfileRoute` (in `ProfileRoute.jsx`): rappresenta la schermata riferita alla schermata utente in cui viene mostrato le informazioni dell'utente piu la possibilita dello storico con dettagli di meme e punteggi associati.

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- mario@test.it, pwd (nuovo utente registrato,nessuna partita registrata )
- marco@test.it, pwd (utente, giocatore di 2 partite)
