import {Button} from "react-bootstrap";
import React, {useContext} from "react";
import UserContext from "../UserProvider";
import {useNavigate} from "react-router-dom";


function Authenticate() {

    const { setIsAuthenticated } = useContext(UserContext);
    const navigate = useNavigate();
    return(
        <div className="container" style={{paddingTop: "20%"}}>
            <Button
                className={"mx-auto d-none d-md-block"}
                variant="outline-primary"
                style={{marginBottom: "8px"}}
                onClick={()=> {
                    setIsAuthenticated(true)
                    navigate("/home")
                    }
                }
            >
                Přihlásit se
            </Button>
            <Button
                className={"mx-auto d-none d-md-block"}
                variant="outline-primary"
                onClick={()=> {
                    setIsAuthenticated(false)
                    navigate("/home")
                }
                }
            >
                Pokračovat bez přihlášení
            </Button>
        </div>
    )
}

export default Authenticate;