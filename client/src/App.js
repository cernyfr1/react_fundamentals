import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Outlet, useNavigate} from "react-router-dom";
import {Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import {useContext} from "react";
import UserContext from "./UserProvider";

function App() {

    let navigate = useNavigate();
    const { isAuthenticated } = useContext(UserContext);
    if (isAuthenticated === undefined) { navigate("/auth") }


    return (
        <div className="App">
            <Navbar
                fixed="top"
                expand={"sm"}
                className="mb-3"
                bg="dark"
                variant="dark"
            >
                <Container fluid>
                    <Navbar.Brand onClick={() => navigate("/home")}>
                        Kuchařka
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
                    <Navbar.Offcanvas id={`offcanvasNavbar-expand-sm`}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                                Kuchařka
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link onClick={() => navigate("/recipeList")}>
                                    Recepty
                                </Nav.Link>
                                <Nav.Link onClick={() => navigate("/ingredientList")}>
                                    Ingredience
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>

            <Outlet />
        </div>
    );
}

export default App;