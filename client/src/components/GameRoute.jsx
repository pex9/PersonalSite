import { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Col, Container, Spinner, Form, Button, Card, ListGroup, Badge, Row } from "react-bootstrap";

import AppContext from "../AppContext";
import ErrorView from "./Error";
import MyNavbar from './MyNavbar';
import API from "../API";
import dayjs from "dayjs";

const url = 'http://localhost:3001/images/';

function ImageComponent(props) {
  const { round, error, listmeme } = props;
  const memeUrl = listmeme && listmeme[round] ? listmeme[round].url : null;

  return (
    <div>
      <h1>ROUND NUMERO {round}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {memeUrl ? (
        <img src={url+ memeUrl} alt="Meme" style={{ width: '500px', height: '500px', objectFit: 'cover' }} />
      ) : (
        <p>Caricamento...</p>
      )}
    </div>
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
          <Card.Img src={url+ imageurl} />
          <Card.Body>
            <Card.Title>ROUND NUMERO {round}</Card.Title>
            {props.right ? (
              <p style={{ color: 'Green' }} >Hai ottenuto 5 punti</p>
            ) : (
              <p style={{ color: 'red' }}>Risposta errata 0 punti </p>
            )}
            
            {props.answer != -1  && props.answer != undefined? (
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
  //inserire score partita a seconda se errato o no per ogni turno guardare quando la risposta è vuota
  console.log(props.captions)
  const right = (props.captions != undefined && props.captions[props.round]) ? props.captions[props.round].find(caption => caption.id === props.choices[props.choices.length - 1])?.isCorrect : false;
  return (
    <Container>
      <Row>
        <h1>Punteggio Totale della partita: {props.score}</h1>
      </Row>
      <Row>
        <h2>Riepilogo: {null}</h2>
      </Row>
      {
        loginState.loggedIn === false && (
          <Row>
            <ListGroup>
              <Row key={props.round} style={{ padding: '1rem' }}>
                <RowMemeComponent  answer = {props.captions[props.round]?.find(caption => caption.id == props.choices[props.choices.length - 1])?.text} right={right} correct_answer={props.captions[props.round]?.filter((caption) => caption.isCorrect)} useranswer={props.answer} answers={props.captions[props.round]} imageurl={props.listmeme[props.round].url} round={props.round} />
              </Row>
            </ListGroup>
          </Row>
        )
      }
      {/* Conditional rendering based on loginState.loggedIn */}
      {loginState.loggedIn === true && (
        Object.keys(props.captions).map(key => {
          const right = (props.captions != undefined && props.captions[key]) ? props.captions[key]?.find(caption => caption.id == props.choices[key-1])?.isCorrect : false;
            return (
            <Row key={`${key}`} style={{ padding: '1rem' }}>
              <RowMemeComponent answer = {props.captions[key]?.find(caption => caption.id == props.choices[key-1])?.text}  right={right} answers={props.captions[key]} correct_answer={props.captions[key]?.filter((caption) => caption.isCorrect)} imageurl={props.listmeme[key].url} round={key} />
            </Row>
            );
        })
      )}
      <Row>
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
  props.choices[props.choices.length - 1]
  const handleNextTurn = () => {
    props.setTimeLeft(30); // Reset the timer for the next turn
    props.setEndRound(false);
    if (loginState.loggedIn) {
      if (props.round < 3) {
        props.setRound(props.round + 1);
      } else {
        props.handleSaveGame();
        props.setGameOver(true);
      }
    } else {
      props.setGameOver(true);
    }
  };

  let previoustext = "";
  let correct_answer = [];
  //console.log(props.choices[props.choices.length - 1]);
  for (let i = 0; i < props.captions[props.round].length; i++) {
    if (props.captions[props.round][i].id == props.choices[props.choices.length - 1]) {
      previoustext = props.captions[props.round][i].text;
      break;
    }
  }
  correct_answer = props.captions[props.round].filter((caption) => caption.isCorrect);
  const responseClass = correct_answer.some(answer => answer.text === previoustext) ? 'correct' : 'incorrect';
  const text = correct_answer.some(answer => answer.text === previoustext) ? 'Risposta corretta ' : 'Risposta sbagliata';
  const caption = props.captions[props.round].find(caption => caption.id === props.choices[props.choices.length - 1]);

  return (
    <Container>
      <Row>
        <h2 className={responseClass}>
          {text}
        </h2>
        <h1>Punteggio corrente {props.score}</h1>
        <h2>Scelta fatta in questo turno: {previoustext !== "" ? previoustext : "Didascalia non scelta"}</h2>
      </Row>
      <Row>
        <ListGroup className="custom-list-group">
          {correct_answer.map((answer, index) => (
            <ListGroup.Item key={index} className="custom-list-group-item">
              <strong>Risposta corretta:</strong> {answer.text}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto" className="p-1">
          <Button variant="primary" onClick={handleNextTurn}>{loginState.loggedIn ? "Prossimo turno" : "Riepilogo"}</Button>
        </Col>
        <Col xs="auto" className="p-1">
          <Button variant="danger" onClick={props.exitGame}>{loginState.loggedIn ? "Abbandona partita" : "Home"}</Button>
        </Col>
      </Row>
    </Container>
  );
}

function CaptionComponentForm(props) {

  const memeid = props.listmeme && props.listmeme[props.round] ? props.listmeme[props.round].id : null;
  useEffect(() => {
    if (props.captions.length > 0) {
      props.setSelectedCaption(-1);
    }
  }, [props.captions]);

  //prima volta che entri qua dentro fetchi anche i possibili didiscalie
  useEffect(() => {
    if (!memeid) {
      return;
    }
    const fetchMemeCaptions = async () => {
      try {
        try {
          const capt = await API.getCaptions(memeid); // Assuming getCaptions fetches captions for a meme id
          //devo andare inserire le domande fetchate dentro le captions
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

    fetchMemeCaptions(); // Call the async function to fetch captions when component mounts
  }, [memeid]); // Dependency array ensures useEffect runs whenever memeid changes


  const handleCaptionChange = (event) => {
    props.setSelectedCaption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (props.selectedCaption !== -1) {
      const selectedCaption = props.captions[props.round].find(caption => caption.id == props.selectedCaption);
      if (selectedCaption && selectedCaption.isCorrect) {
        props.setScore(props.score + 5);
        props.setAnswer(true);
      }
    }
    if (props.round < 3) {
      props.setChoices([...props.choices, props.selectedCaption]);
      props.setEndRound(true);
    } else {
      props.setChoices([...props.choices, props.selectedCaption]);
      props.handleSaveGame();
      props.setGameOver(true);
    }
  };

  useEffect(() => {
    if (props.timeLeft === 0) {
      if (props.round <= 3) {
        props.setEndRound(true);
      } else {
        props.setGameOver(true);
      }
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
      <Badge bg="light" className="countdown-timer">
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
  const [memeImage, setMemeImage] = useState(null);
  const [error, setError] = useState(null);
  // per problemi di use effect duplicata ho dovuto prelevare tutti i meme in una lista e poi prelevare i meme uno alla volta
  const [listmeme, setListMeme] = useState([]);
  const [round, setRound] = useState(1);
  const [captions, setCaptions] = useState({});
  const [selectedCaption, setSelectedCaption] = useState(-1);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [endRound, setEndRound] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState({});


  const context = useContext(AppContext);
  const loginState = context.loginState;

  const navigate = useNavigate();

  const handleRetry = () => {
    setScore(0);
    setGameOver(false);
    setRound(1);
    setChoices([]);
    setEndRound(false);
    setTimeLeft(30);
    setListMeme
    const shuffledListMeme = listmeme.slice().sort(() => Math.random() - 0.5);
    setListMeme(shuffledListMeme);

  };

  const exitGame = () => {
    navigate("/");
  };

  const handleSaveGame = async () => {
    const creationDate = dayjs().format('YYYY-MM-DD');
    try {
      const response = await API.saveGame(score, creationDate, listmeme.slice(1, 4).map(meme => meme.url).join(','));
      if (response.ok) {
        setGameOver(true);
      } else {
        setError('Failed to save game.');
      }
    } catch (error) {
      setError(error.message || 'Unknown error occurred');
    }
  };


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
          <ImageComponent listmeme={listmeme} error={error} round={round} />
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
            setAnswer={setAnswer}
            listmeme={listmeme}
            round={round}
            setEndRound={setEndRound}
          />
        </Container>
      );
    } else {
      return (
        <Container>
          <MessageComponent
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
            answer={answer}
          />
        </Container>
      );
    }
  } else {
    return (
      <InfoComponent
        answers={answers}
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
  const context = useContext(AppContext);
  const loadingState = context.loadingState;
  const handleErrorState = context.handleErrorState;

  if (handleErrorState.errMsg || context.gameStarted) {
    return <ErrorView />;
  }

  if (loadingState.loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner variant="primary" />
      </Container>
    );
  }

  return (
    <>
      <MyNavbar />
      <MemeComponent />
    </>
  );
}

export default GameRoute;