
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Button, Card, Row, Spinner } from "react-bootstrap";
import API from "../API";
const url = 'http://localhost:3001/images/';
import MyNavbar from './MyNavbar';
import DefaultRoute from "./DefaultRoute";

function RowMemeComponent(props) {
  const { imageurl, round, score } = props;

  return (
    <Card>
      <Row>
        <Col md={3}>
          <Card.Img src={imageurl} />
          <Card.Body>
            <Card.Title>ROUND {round}</Card.Title>
          </Card.Body>
        </Col>
        <Col md={9}>
          <h2 className={score == 0 ? 'text-danger' : 'text-success'}>{score === 0 ? 'In questo round hai sbagliato,  0 punti ottenuti in questo round' : 'In questo round hai indovinato,  5 punti ottenuti in questo round'}</h2>
        </Col>
      </Row>
    </Card>
  );
}

function ViewGameRoute(props) {
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [listmeme, setListmeme] = useState(null);
  const [localHistoryLoading, setLocalHistoryLoading] = useState(true); // inizia il caricamento della partita che si sta visualizzando

  const { gameid } = useParams(); // permette di ottenere i parametri dall'url tramite params

  // Funzione per tornare indietro dalla visualizzazione della partita
  const handleBack = () => {
    navigate(-1); // 
  };
  //eseguo la fetch del gioco andando a prendere il gioco tramite l'id e valorizzando lo stato game e listmeme
  useEffect(() => {
    async function fetchGame() {
      try {
        const viewgame = await API.getGame(gameid);
        setGame(viewgame);
        setListmeme(viewgame.listmeme.split(","));
        setLocalHistoryLoading(false); // fine del caricamento
      } catch (err) {
        console.error(err);
      }
    }
    fetchGame();
  }, []);

  return (
    <>
      {localHistoryLoading ? (
        <Container className="my-5 text-center">
          <Spinner animation="border" variant="primary" />
        </Container>
      ) : (
        <>
          <MyNavbar type={props.type} />
          <Container>
            {game ? (
              <>
                <Row>
                  <h1>Punteggio Totale della partita: {game.score.split(',').map(Number).reduce((acc, score) => acc + score, 0)}</h1>
                </Row>
                <Row>
                  <Col>
                    <Button variant="danger" onClick={handleBack}>
                      Indietro
                    </Button>
                  </Col>
                </Row>
                {listmeme ? (
                  listmeme.map((meme, index) => (
                    <Row key={index} className="meme-view-style">
                      <RowMemeComponent
                        key={index}
                        imageurl={url + meme}
                        round={index + 1}
                        score={game.score.split(',').map(Number)[index]}
                      />
                    </Row>
                  ))
                ) : (
                  <p>nessun meme disponibile</p>
                )}
              </>
            ) : (
              <DefaultRoute />
            )}
          </Container>
        </>
      )}
    </>
  );
}

export default ViewGameRoute;
