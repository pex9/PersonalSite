
import MyMain from "./Main";
import MyNavbar from './MyNavbar';

function HomeRoute(props) {

    return (
        <>
            <MyNavbar type={props.type} />
            <MyMain type={props.type} />
        </>

    );
}

export default HomeRoute;