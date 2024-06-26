import { useContext } from "react";
import { Container, Spinner } from "react-bootstrap";
import MyMain from "./Main";
import AppContext from "../AppContext";
import MyNavbar from './MyNavbar';

function HomeRoute(props) {
    const context = useContext(AppContext);
    const loadingState = context.loadingState;
    const handleErrorState = context.handleErrorState;

    return(
        <>
                    { loadingState.loading ? <Container className='my-5 text-center'> <Spinner variant='primary' /> </Container> :
                        <>
                            <MyNavbar type={props.type} />
                            <MyMain type={props.type} /> 
                        </>
                    }
        </>    
    );
} 

export default HomeRoute;