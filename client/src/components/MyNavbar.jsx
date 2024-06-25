import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import AppContext from '../AppContext';

export function MyNavbar() {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const loginState = context.loginState;

  return (
    <Navbar bg="primary" variant="dark">
      <Container fluid>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-between">
          <div className="d-flex align-items-center">
            <div className="mx-auto text-center"><h1 style={{ color: 'white' }}> GIOCO DI MEME </h1></div>
          </div>
          <div>
            {loginState.loggedIn ? (
              <>
                <Navbar.Text>
                  {'Signed in as: ' + loginState.user.name}
                </Navbar.Text>
                <Button className='mx-2 rounded-pill' variant='info' onClick={() => navigate('/profile')}>
                  {'My Profile'}
                  <i className="bi bi-person" />
                </Button>
                <Button className='mx-2 rounded-pill' variant='info' onClick={() => navigate('/')}>
                  {'Home '}
                  <i className="bi bi-house" />
                </Button>
                <Button className='mx-2 rounded-pill' variant='danger' onClick={() => {
                  loginState.doLogout();
                  navigate('/');
                }}>
                  {'Logout '}
                  <i className="bi bi-person-fill" />
                </Button>
              </>
            ) : (
              <>
                <Button className='mx-2 rounded-pill' variant='info' onClick={() => navigate('/')}>
                  {'Home '}
                  <i className="bi bi-house" />
                </Button>
                <Button className='mx-2 rounded-pill' variant='info' onClick={() => navigate('/login')}>
                  {'Login '}
                  <i className="bi bi-person-fill" />
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default MyNavbar;
