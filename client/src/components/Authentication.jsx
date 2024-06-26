import { Row, Col, Form, Alert, Button, Container, Card, FloatingLabel } from 'react-bootstrap';
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import API from '../API';
import AppContext from '../AppContext';
import MyNavbar from './MyNavbar';


function LoginForm(props) {
    const [username, setUsername] = useState('mario@test.it');
    const [password, setPassword] = useState('pwd');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const context = useContext(AppContext);
    const loginState = context.loginState;

    function doLogIn(credentials) {
        API.login(credentials)
            .then(user => {
                setErrMsg('');
                loginState.loginSuccessful(user);
                navigate('/');
            })
            .catch(err => {
                setErrMsg('Wrong username and/or password');
            })
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrMsg('');
        const credentials = { username, password };

        //Form validation
        if (username === '')
            setErrMsg('Username is a required field!');
        else if (password === '')
            setErrMsg('Password is a required field!');
        else
            doLogIn(credentials);
    }

    return (
        <Container>
            <Row className='my-5'>
                <Col className='col-3'></Col>
                <Col className='col-6'>
                    <Row>
                        <Col className='col-2'></Col>
                        <Col>
                            <Card>
                                <Card.Header as='h2'>Login</Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleSubmit}>
                                        {errMsg ? <Alert variant='danger' dismissible onClick={() => setErrMsg('')}>{errMsg}</Alert> : undefined}
                                        <FloatingLabel controlId="username" label="Username" className="mb-3">
                                            <Form.Control type="email" name='username' value={username} onChange={ev => setUsername(ev.target.value)} />
                                        </FloatingLabel>
                                        <FloatingLabel controlId="password" label="Password" className="mb-3">
                                            <Form.Control type="password" name='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                                        </FloatingLabel>
                                        <Button type='submit' className='my-2 rounded-pill'>Login</Button>
                                        <Button className='mx-3 rounded-pill' variant='danger' onClick={() => {
                                            navigate('/');
                                        }} >Cancel</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className='col-2'></Col>
                    </Row>
                </Col>
                <Col className='col-3'></Col>
            </Row>
        </Container>
    );

}

function LoginRoute(props) {

    return (
        <>
            <MyNavbar />
            <LoginForm />
        </>
    );
}

export default LoginRoute;