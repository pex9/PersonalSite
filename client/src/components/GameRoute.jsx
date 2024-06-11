import { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Form, Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import MyMain from "./Main";
import AppContext from "../AppContext";
import ErrorView from "./Error";
import MyNavbar from "./Navbar";
import API from "../API";
import dayjs from "dayjs";

function ImageComponent({ memeImage, error, round }) {
  return (
    <div>
      <h1>ROUND NUMERO {round}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {memeImage ? (
        <img src={memeImage.url} alt="Meme" style={{ width: '500px', height: '500px', objectFit: 'cover' }} />
      ) : (
        <p>Caricamento...</p>
      )}
    </div>
  );
}

function InfoComponent({ score, choices, handleRetry }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Punteggio: {score}</h1>
      <h2>Scelte fatte:</h2>
      <ListGroup style={{ marginBottom: '20px' }}>
        {choices.map((choice, index) => (
          <ListGroupItem key={index}>
            <strong>Round {index + 1}:</strong> {choice}
          </ListGroupItem>
        ))}
      </ListGroup>
      <Button variant="primary" onClick={handleRetry}>
        Riprova
      </Button>
    </div>
  );
}

function MessageComponent({
  round,
  setTimeLeft,
  setEndRound,
  setRound,
  choices,
  setChoices,
  setGameOver,
  endRound,
  setScore,
  score,
  memeImage,
  captions,
  error,
  exitGame,
  handleSaveGame,
}) {
  const context = useContext(AppContext);
  const loginState = context.loginState;
  
  const handleNextTurn = () => {
    setTimeLeft(30); // Reset the timer for the next turn
    setEndRound(false);
    if (loginState.loggedIn) {
      if (round < 3) {
        setRound(round + 1);
      } else {
        handleSaveGame();
      }
    } else {
      setGameOver(true);
    }
  };

  let previousText = "";
  const correctAnswers = captions.filter(caption => caption.isCorrect);

  if (choices.length > 0) {
    const lastChoice = choices[choices.length - 1];
    const lastCaption = captions.find(caption => caption.id === lastChoice);
    if (lastCaption) {
      previousText = lastCaption.text;
      if (lastCaption.isCorrect) {
        console.log("Correct choice");
        setScore(score + 5);
      }
    }
  }

  return (
    <>
      <ImageComponent memeImage={memeImage} error={error} round={round} />
      <div>
        <h1>Punteggio corrente: {score}</h1>
        <h2>Scelta fatta in questo turno: {previousText || "Didascalia non scelta"}</h2>
        <ListGroup className="custom-list-group">
          {correctAnswers.map((answer, index) => (
            <ListGroupItem key={index} className="custom-list-group-item">
              <strong>Risposta corretta:</strong> {answer.text}
            </ListGroupItem>
          ))}
        </ListGroup>
        <Button variant="primary" onClick={handleNextTurn}>
          {loginState.loggedIn ? "Prossimo turno" : "Riepilogo"}
        </Button>
        <Button variant="danger" onClick={exitGame}>
          {loginState.loggedIn ? "Abbandona partita" : "Home"}
        </Button>
      </div>
    </>
  );
}

function CaptionComponentForm({
  captions,
  setSelectedCaption,
  selectedCaption,
  round,
  setRound,
  setChoices,
  choices,
  setEndRound,
  setGameOver,
  timeLeft,
  setTimeLeft,
  exitGame,
  handleSaveGame,
}) {
  useEffect(() => {
    if (captions.length > 0) {
      setSelectedCaption(captions[0].id);
    }
  }, [captions, setSelectedCaption]);

  const handleCaptionChange = event => {
    setSelectedCaption(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (selectedCaption !== -1) {
      setChoices([...choices, selectedCaption]);
    }
    if (round < 3) {
      setEndRound(true);
    } else {
      handleSaveGame();
      setGameOver(true);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      if (round < 3) {
        setEndRound(true);
      } else {
        setGameOver(true);
      }
    } else {
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timeLeft, setEndRound, setGameOver, round]);

  return (
    <>
      <div className="countdown-timer">Tempo rimanente: {timeLeft} secondi</div>
      <Card className="card-custom">
        <Card.Header className="card-header-custom">
          <Card.Subtitle className="card-subtitle-custom">
            Seleziona la Didascalia che si adatta meglio a questo meme
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCaption" className="form-group-custom">
              <Form.Control as="select" onChange={handleCaptionChange}>
                <option value="-1">Seleziona una possibile didascalia</option>
                {captions.map((caption, index) => (
                  <option key={index} value={caption.id}>
                    {caption.text}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" className="button-custom" type="submit">
              Conferma
            </Button>
            <Button variant="danger" onClick={exitGame}>
              Abbandona Partita
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

function MemeComponent() {
  const [memeImage, setMemeImage] = useState(null);
  const [error, setError] = useState(null);
  const [listmeme, setListMeme] = useState([]);
  const [round, setRound] = useState(1);
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [endRound, setEndRound] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const context = useContext(AppContext);
  const loginState = context.loginState;

  const navigate = useNavigate();

  const handleRetry = () => {
    setScore(0);
    setGameOver(false);
    setListMeme([]);
    setRound(1);
    setChoices([]);
    setEndRound(false);
    setTimeLeft(30);
  };

  const exitGame = () => {
    navigate("/");
  };

  const handleSaveGame = async () => {
    const creationDate = dayjs().format('YYYY-MM-DD');
    const response = await API.saveGame(score, creationDate);
    if (response.ok) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    const fetchMemeImage = async () => {
      try {
        //context.loadingState.updateLoading(true);
        let image = null;
        let isMemePresent = true;
        while (isMemePresent) {
          image = await API.getMemeImage();
          if (!listmeme.includes(image.url)) {
            isMemePresent = false;
          }
        }
        setMemeImage(image);
        setListMeme(prevListMeme => [...prevListMeme, image.url]);
        //context.loadingState.updateLoading(false);
        const captions = await API.getCaptions(image.id);
        setCaptions(captions);
      } catch (err) {
        setError(err.error || 'Unknown error');
      }
    };
  
    if (round > 1 || memeImage === null) {
      fetchMemeImage();
    }
  }, [round]);

  if (!gameOver) {
    if (!endRound) {
      return (
        <>
          <ImageComponent memeImage={memeImage} error={error} round={round} />
          <CaptionComponentForm
            captions={captions}
            selectedCaption={selectedCaption}
            setSelectedCaption={setSelectedCaption}
            round={round}
            setRound={setRound}
            setChoices={setChoices}
            choices={choices}
            setEndRound={setEndRound}
            setGameOver={setGameOver}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            exitGame={exitGame}
            handleSaveGame={handleSaveGame}
          />
        </>
      );
    } else {
      return (
        <MessageComponent
          round={round}
          setTimeLeft={setTimeLeft}
          setRound={setRound}
          choices={choices}
          setChoices={setChoices}
          setGameOver={setGameOver}
          endRound={endRound}
          setScore={setScore}
          score={score}
          setEndRound={setEndRound}
          memeImage={memeImage}
          captions={captions}
          error={error}
          exitGame={exitGame}
          handleSaveGame={handleSaveGame}
        />
      );
    }
  } else {
    return (
      <InfoComponent score={score} handleRetry={handleRetry} error={error} round={round} choices={choices} />
    );
  }
}

function GameRoute(props) {
  const context = useContext(AppContext);
  const loadingState = context.loadingState;
  const handleErrorState = context.handleErrorState;

  return (
    <>
      {handleErrorState.errMsg || context.gameStarted ? (
        <ErrorView />
      ) : (
        <>
          {loadingState.loading ? (
            <Container className="my-5 text-center">
              <Spinner variant="primary" />
            </Container>
          ) : (
            <>
              <MyNavbar type={props.type} />
              <MemeComponent />
            </>
          )}
        </>
      )}
    </>
  );
}

export default GameRoute;
