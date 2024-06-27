import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

function Description({ startGame }) {
    return (
        <Row>
            <Col>
                <h1>Benvenuto al Gioco del Meme</h1>
                <p>
                    Il giocatore riceve un’immagine di un meme casuale e sette possibili didascalie per quel meme in ordine casuale.
                    Sia l’immagine del meme che le didascalie devono essere generate dal server. Tra le sette didascalie, due di esse
                    devono essere tra quelle che meglio si adattano a quel meme. Il giocatore deve selezionare una didascalia che meglio
                    si adatta al meme entro 30 secondi. Se il giocatore seleziona una delle due didascalie più appropriate per il meme entro
                    30 secondi, ottiene 5 punti altrimenti, se seleziona una delle altre didascalie o il tempo scade, ottiene 0 punti.
                </p>
                <Button onClick={startGame} variant="info">
                    INIZIA GIOCO
                </Button>
            </Col>
        </Row>
    );
}

function MyMain() {
    const navigate = useNavigate();

    const startGame = () => {
        navigate('/game');  // Naviga alla pagina del gioco
    };

    return (
        <Container>
            <Description startGame={startGame} />
        </Container>
    );
}

export default MyMain;
