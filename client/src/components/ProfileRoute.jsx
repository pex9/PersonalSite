import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Col, Container, Button, Card, Row } from "react-bootstrap";
import AppContext from "../AppContext";
import MyNavbar from './MyNavbar';

function MyProfileComp(props) {
    return (
        <Card className="text-center shadow card-profile-costom" >
            <Card.Body>
                <Card.Title>Utente</Card.Title>
                <Card.Text><strong>Email:</strong> {props.user.username}</Card.Text>
                <Card.Text><strong>Name:</strong> {props.user.name}</Card.Text>
            </Card.Body>
        </Card>
    );
}
function HistoryComp() {
    const navigate = useNavigate();

    const handleHistoryClick = () => {
        navigate('/history'); // Adjust the path according to your routing setup
    };

    return (
        <Card className="text-center shadow card-profile-costom" >
            <Card.Body>
                <Card.Title>History</Card.Title>
                <Button variant="primary" onClick={handleHistoryClick}>
                    View History
                </Button>
            </Card.Body>
        </Card>
    );
}


function ProfileRoute(props) {
    const context = useContext(AppContext);
    return (
        <>
            <MyNavbar type={props.type} />
            <Container>
                <Row >
                    <Col xs={6} md={6} className="mt-4">
                        <MyProfileComp user={context.loginState.user} />
                    </Col>
                    <Col xs={6} md={6} className="mt-4">
                        <HistoryComp />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export default ProfileRoute;