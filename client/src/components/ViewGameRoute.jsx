import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Button, Card, ListGroup, Badge, Row } from "react-bootstrap";
import AppContext from "../AppContext";
import ErrorView from "./Error";
import MyNavbar from './MyNavbar';
import API from "../API";
import dayjs from "dayjs";
const url = 'http://localhost:3001/images/';

function RowMemeComponent(props) {
    const { imageurl, round} = props;
    /*const renderedAnswers = Array.isArray(answers) ? (
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
    );*/
  
    return (
      <Card>
        <Row>
          <Col md={3}>
            <Card.Img src={imageurl} />
            <Card.Body>
              <Card.Title>ROUND NUMERO {round}</Card.Title>
            </Card.Body>
          </Col>
          <Col md={9}>
            <ListGroup>
              
            </ListGroup>
          </Col>
        </Row>
      </Card>
    );
  }

function ViewGameRoute(props) {
    const context = useContext(AppContext);
    const loginState = context.loginState;
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [listmeme, setListmeme] = useState(null);

    const { gameid } = useParams(); // Extract game ID from route parameters
    console.log("quale id mi arraiva "+gameid);

    const goHome = () => {
        navigate("/");
    };
    //eseguo la fetch del gioco
    useEffect(() => {
        async function fetchGame() {
            try {
                const ga= await API.getGame(gameid);
                setGame(ga);
                console.log(ga)
                if( ga != null && ga.listmeme !== null)
                {
                        setListmeme(ga.listmeme.split(","));
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchGame();
    }, []);

    return (
        console.log(listmeme),
            <Container>
               {game ? (
                <>
                    <Row>
                        <h1>Punteggio Totale della partita: {game.score}</h1>
                    </Row>
                    <Row>
                        <h2>Riepilogo: {null}</h2>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="danger" onClick={goHome}>
                                Home
                            </Button>
                        </Col>
                    </Row>
                    
                        {listmeme ? (
                            listmeme.map((meme, index) => (
                                <Row key={index+1} style={{ padding: '1rem' }}>
                                <RowMemeComponent key={index+1} imageurl={url+meme} round={index+1} />
                                </Row>
                            ))
                        ) : (
                            <p>nessun meme disponibile</p>
                        )}  
                </>
               ) : (
                <ErrorView error={game} />
                )}
            </Container>
        );
}

export default ViewGameRoute;
