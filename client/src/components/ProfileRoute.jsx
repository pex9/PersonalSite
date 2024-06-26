import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Col, Container, Button, Card, ListGroup, Badge, Row } from "react-bootstrap";
import AppContext from "../AppContext";
import ErrorView from "./Error";
import MyNavbar from './MyNavbar';
import API from "../API";

function MyProfileComp(props) {
    return (
        <Card className="text-center shadow" style={{ width: '100%', maxWidth: '400px', margin: 'auto',height: '100%' }}>
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
        <Card className="text-center shadow" style={{ width: '100%', maxWidth: '400px', margin: 'auto',height: '100%' }}>
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
    const loadingState = context.loadingState;
    const handleErrorState = context.handleErrorState;
    console.log(context.loginState);
    return (
        <>
            {handleErrorState.errMsg ?
                <ErrorView /> :
                <>
                    {loadingState.loading ? <Container className='my-5 text-center'> <Spinner variant='primary' /> </Container> :
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
                    }
                </>
            }
        </>
    );
}
export default ProfileRoute;