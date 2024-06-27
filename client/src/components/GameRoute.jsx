import { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Col, Container, Spinner, Form, Button, Card, ListGroup, Badge, Row, CardImg } from "react-bootstrap";
import AppContext from "../AppContext";
import MyNavbar from './MyNavbar';
import API from "../API";
import dayjs from "dayjs";
const url = 'http://localhost:3001/images/';

function ImageComponent(props) {
  const { round, listmeme } = props;
  const memeUrl = listmeme && listmeme[round] ? listmeme[round].url : null;
  return (
    <Row>
      <Col ></Col>
      <Card className="card-image-comp mt-3" >
        <Card.Body>
          <Card.Title className="fw-bold">  ROUND {round}</Card.Title>
          {memeUrl ? (
            <CardImg src={url + memeUrl} alt="Meme" className="custom-card-img" />
          ) : (
            <Container className='my-5 text-center'> <Spinner variant='primary' /> </Container> //finche il meme non è caricato mostro lo spinner
          )}
        </Card.Body>
      </Card>
      <Col ></Col>
    </Row>
  );
}

function RowMemeComponent(props) {
  const { imageurl, round, answers } = props;
  const renderedAnswers = Array.isArray(answers) ? (
    answers.map((item, index) => (
      <ListGroup.Item
        key={index}
        variant={props.correct_answer.some(answer => answer.id === item.id) ? 'success' : ''}
      >
        {item.text}
      </ListGroup.Item>
    ))
  ) : (
    <ListGroup.Item>Nessuna risposta disponibile</ListGroup.Item>
  );

  return (
    <Card>
      <Row>
        <Col md={3}>
          <Card.Img src={url + imageurl} />
          <Card.Body>
            <Card.Title>ROUND {round}</Card.Title>
            {props.right ? (
              <h3 className="correct" >Risposta Corretta Hai ottenuto 5 punti</h3>
            ) : (
              <h3 className="incorrect">Risposta errata 0 punti </h3>
            )}

            {props.answer != -1 && props.answer != undefined ? (
              <p> Risposta Selezionata {props.answer}</p>
            ) : (
              <p>Non hai selezionato nessuna didascalia</p>
            )}
          </Card.Body>
        </Col>
        <Col md={9}>
          <ListGroup>
            {renderedAnswers}
          </ListGroup>
        </Col>
      </Row>
    </Card>
  );
}

function InfoComponent(props) {
  const context = useContext(AppContext);
  const loginState = context.loginState;
  const scoretotal = props.score.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  //inserire score partita a seconda se errato o no per ogni turno guardare quando la risposta è vuota
  const right = (props.captions != undefined && props.captions[props.round]) ? props.captions[props.round].find(caption => caption.id == props.choices[props.choices.length - 1])?.isCorrect : false;
  return (
    <Container>
      <Row className="m-3">
        <h1>Punteggio Totale della partita: {props.score.reduce((accumulator, currentValue) => accumulator + currentValue, 0)} </h1>
      </Row>
      {
        loginState.loggedIn === false && right == true && (
          <Row>
            <ListGroup>
              <Row key={props.round}>
                <RowMemeComponent answer={props.captions[props.round]?.find(caption => caption.id == props.choices[props.choices.length - 1])?.text} right={right} correct_answer={props.captions[props.round]?.filter((caption) => caption.isCorrect)} useranswer={props.answer} answers={props.captions[props.round]} imageurl={props.listmeme[props.round].url} round={props.round} />
              </Row>
            </ListGroup>
          </Row>
        )
      }
      {
        loginState.loggedIn === true && (
          Object.keys(props.captions).map(key => {
            const right = (props.captions != undefined && props.captions[key]) ? props.captions[key]?.find(caption => caption.id == props.choices[key - 1])?.isCorrect : false;
            if (right == true) {
              return (
                <Row key={`${key}`} className="m-3" >
                  <RowMemeComponent answer={props.captions[key]?.find(caption => caption.id == props.choices[key - 1])?.text} right={right} answers={props.captions[key]} correct_answer={props.captions[key]?.filter((caption) => caption.isCorrect)} imageurl={props.listmeme[key].url} round={key} />
                </Row>
              );
            }
          })
        )}
      {
        scoretotal === 0 ? (
          <h1 className="text-danger">Nessuna risposta è stata indovinata. Giocane un'altra </h1>
        ) : null
      }
      <Row className="mt-3">
        <Col>
          <Button variant="danger" onClick={props.exitGame}>
            Home
          </Button>
        </Col>
        <Col>
          <Button variant="primary" onClick={props.handleRetry}>
            Riprova
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

function MessageComponent(props) {
  const context = useContext(AppContext);
  const loginState = context.loginState;
  // funzione per gestire il prossimo turno, se l'utente è loggato e il round è minore di 3 incremento il round altrimenti salvo la partita
  const handleNextTurn = () => {
    props.setTimeLeft(30); // risetto timer per il prossimo turno
    props.setEndRound(false);
    if (loginState.loggedIn) {
      if (props.round < 3) {
        props.setRound(props.round + 1);
      } else {
        props.handleSaveGame();
        props.setGameOver(true);
      }
    } else {
      props.setGameOver(true); // se non è loggato il gioco è finito visto che dura solo un round
    }
  };

  let previoustext = "";
  let correct_answer = [];
  // cerco la didascalia che l'utente ha scelto per il meme avendo gli id
  for (let i = 0; i < props.captions[props.round].length; i++) {
    if (props.captions[props.round][i].id == props.choices[props.choices.length - 1]) {
      previoustext = props.captions[props.round][i].text;
      break;
    }
  }
  const resultOkText = () => {
    if (loginState.loggedIn && props.round === 3) {
      return "Riepilogo partita";
    } else if (loginState.loggedIn && props.round < 3) {
      return "Prossimo turno";
    } else {
      return "Nuova partita";
    }
  };


  correct_answer = props.captions[props.round].filter((caption) => caption.isCorrect);
  const responseClass = correct_answer.some(answer => answer.text === previoustext) ? 'correct' : 'incorrect';
  const text = correct_answer.some(answer => answer.text === previoustext) ? 'Risposta corretta ' : 'Risposta sbagliata';
  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className={responseClass}>
            {text}
          </h1>
          <h1>Punteggio corrente: {props.score.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</h1>
          <h2>Scelta fatta: {previoustext !== "" ? previoustext : "Didascalia non scelta"}</h2>
        </Col>
      </Row>
      <Row className="mb-4">
        <ListGroup>
          {correct_answer.map((answer, index) => (
            <Col key={index}>
              <ListGroup.Item variant="success" key={index} className="custom-list-group-item mb-2">
                <strong>Risposta corretta:</strong> {answer.text}
              </ListGroup.Item>
            </Col>
          ))}
        </ListGroup>

      </Row>

      <Row className="justify-content-center">
        <Col xs="auto" className="p-1">
          <Button variant="primary" onClick={loginState.loggedIn ? handleNextTurn : props.handleRetry}>
            {resultOkText()}
          </Button>
        </Col>
        {(props.round != 3) && (
          <Col xs="auto" className="p-1">
            <Button variant="danger" onClick={props.exitGame}>
              {loginState.loggedIn ? "Abbandona partita" : "Home"}
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
}
function CaptionComponentForm(props) {

  const memeid = props.listmeme && props.listmeme[props.round] ? props.listmeme[props.round].id : null;
  // se il meme cambia azzero la didascalia selezionata visto che utente non ha confermato nessuna scelta di conseguenza non ha scelta nessuna 
  useEffect(() => {
    if (props.captions.length > 0) {
      props.setSelectedCaption(-1);
    }
  }, [props.captions]);

  //preleva le didascalie per il meme preesente
  useEffect(() => {
    if (!memeid) {
      return;
    }
    const fetchMemeCaptions = async () => {
      try {
        try {
          const capt = await API.getCaptions(memeid); // fetcha le didascalie per il meme
          //aggiorno lo stato delle didascalie per il meme scelto
          props.setCaptions((prevCaptions) => ({
            ...prevCaptions,
            [props.round]: capt,
          }));
        } catch (error) {
          console.error('Error fetching meme captions:', error);
        }
      } catch (error) {
        console.error('Error fetching meme captions:', error);
      }
    };

    fetchMemeCaptions(); // chiamo la funzione 
  }, [memeid]); // se cambia il meme id fetcho le didascalie nella useEffect per ottenere le didascalie associate


  const handleCaptionChange = (event) => {
    props.setSelectedCaption(event.target.value);
  };
  // funzione per gestire la conferma della didascalia scelta dall'utente con controllo che la didascalia sia corretta(incremento score +5 ) o meno (nessun incremento score)
  const handleSubmit = (event) => {
    event.preventDefault();
    if (props.selectedCaption !== -1) {
      const selectedCaption = props.captions[props.round].find(caption => caption.id == props.selectedCaption);
      if (selectedCaption && selectedCaption.isCorrect) {
        props.setScore((oldscore) => [...oldscore, 5]);
      } else {
        props.setScore((oldscore) => [...oldscore, 0]);
      }
    } else {
      props.setScore((oldscore) => [...oldscore, 0]);
    }
    props.setChoices([...props.choices, props.selectedCaption]);
    props.setEndRound(true);
  };

  // useEffect per gestire il timer del gioco, se counter arriva a 0 il round è finito e la Didascalia non è stata scelta dall'utente in quanto non ha confermato la scelta
  useEffect(() => {
    if (props.timeLeft === 0) {
      props.setEndRound(true);
      return;
    }
    const intervalId = setInterval(() => {
      props.setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [props.timeLeft]);

  const captionsForRound = props.captions[props.round] || [];
  return (
    <Container>
      <Badge bg="transparent" className="countdown-timer m-2" >
        Tempo rimanente: {props.timeLeft} secondi
      </Badge>
      <Card className="card-custom">
        <Card.Header className="card-header-custom">
          <Card.Subtitle className="card-subtitle-custom">Seleziona la Didascalia che si adatta meglio a questo meme</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCaption" className="form-group-custom">
              <Form.Control as="select" value={props.selectedCaption} onChange={handleCaptionChange}>
                <option value={-1}>Seleziona una possibile didascalia</option>
                {captionsForRound.map((caption) => (
                  <option key={caption.id} value={caption.id}>
                    {caption.text}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Row>
              <Col>
                <Button variant="primary" className="button-custom" type="submit">
                  Conferma
                </Button>
              </Col>
              <Col>
                <Button variant="danger" onClick={props.exitGame}>
                  Abbandona Partita
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

function MemeComponent() {
  const [error, setError] = useState(null);
  const [listmeme, setListMeme] = useState([]); // lista dei meme correttamente presi dal server
  const [round, setRound] = useState(1); //stato per tenere conto del round corrente del gioco
  const [captions, setCaptions] = useState({}); // stato per tenere traccia delle didascalie per ogni meme assiociato
  const [selectedCaption, setSelectedCaption] = useState(-1); // stato per tenere traccia della didascalia selezionata dall'utente per il meme corrente
  const [choices, setChoices] = useState([]); // stato per tenere traccia delle scelte fatte dall'utente per ogni round
  const [score, setScore] = useState([]); // stato per tenere traccia del punteggio ottenuto dall'utente per ogni round nella forma 5,0,5
  const [gameOver, setGameOver] = useState(false); // stato per tenere traccia se il gioco è finito, valorizzato quando utente ha terminato tutti i round
  const [endRound, setEndRound] = useState(false); // stato per tenere traccia se il round è finito
  const [timeLeft, setTimeLeft] = useState(30); // stato per tenere traccia del tempo rimanente per ogni round e aggiornato dalla use effect

  const navigate = useNavigate();

  // funzione per ricominciare il gioco, che azzera tutti gli stati e rimescola i meme per avere un nuovo gioco
  const handleRetry = () => {
    setScore([]);
    setGameOver(false);
    setRound(1);
    setChoices([]);
    setEndRound(false);
    setTimeLeft(30);
    const shuffledListMeme = listmeme.slice().sort(() => Math.random() - 0.5);
    setListMeme(shuffledListMeme);

  };

  // funzione per uscire dal gioco e tornare alla home
  const exitGame = () => {
    navigate("/");
  };

  // funzione per salvare il gioco, che invia al server il punteggio ottenuto e la data di creazione del gioco 
  const handleSaveGame = async () => {

    const creationDate = dayjs().format('YYYY-MM-DD HH:mm');
    const gamescore = [...score].join(","); // prendo il risultato precedente
    try {
      const response = await API.saveGame(gamescore, creationDate, listmeme.slice(1, 4).map(meme => meme.url).join(','));
      if (response.ok) {
        setGameOver(true);
      } else {
        setError('Failed to save game.');
      }
    } catch (error) {
      setError(error.message || 'Unknown error occurred');
    }
  };

  // fetch dei meme all'avvio del componente per avere i meme da mostrare all'utente
  useEffect(() => {
    try {
      const fetchMemeImages = async () => {
        try {
          const images = await API.getMemeImages();
          setListMeme(images);

        } catch (err) {
          setError(err.message || 'Unknown error');
        }
      };


      fetchMemeImages();
    } catch (err) {
      setError(err.message || 'Unknown error');
    }
  }, []);
  if (!gameOver) {
    if (!endRound) {
      return (
        <Container>
          <Row >
            <ImageComponent listmeme={listmeme} error={error} round={round} />
          </Row>
          <Row>
            <CaptionComponentForm
              captions={captions}
              setCaptions={setCaptions}
              selectedCaption={selectedCaption}
              setSelectedCaption={setSelectedCaption}
              setChoices={setChoices}
              choices={choices}
              setGameOver={setGameOver}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              exitGame={exitGame}
              handleSaveGame={handleSaveGame}
              setScore={setScore}
              score={score}
              listmeme={listmeme}
              round={round}
              setEndRound={setEndRound}
            />
          </Row>
        </Container>
      );
    } else {
      return (
        <Container>
          <MessageComponent
            handleRetry={handleRetry}
            round={round}
            setTimeLeft={setTimeLeft}
            setRound={setRound}
            setChoices={setChoices}
            choices={choices}
            setGameOver={setGameOver}
            endRound={endRound}
            setScore={setScore}
            score={score}
            setEndRound={setEndRound}
            listmeme={listmeme}
            captions={captions}
            error={error}
            exitGame={exitGame}
            handleSaveGame={handleSaveGame}
          />
        </Container>
      );
    }
  } else {
    return (
      <InfoComponent
        listmeme={listmeme}
        score={score}
        handleRetry={handleRetry}
        error={error}
        round={round}
        exitGame={exitGame}
        captions={captions}
        choices={choices}
      />
    );
  }
}

function GameRoute() {
  return (
    <>
      <MyNavbar />
      <MemeComponent />
    </>
  );
}

export default GameRoute;