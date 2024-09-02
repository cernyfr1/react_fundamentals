import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, CardImg, CardTitle} from "react-bootstrap";
import {mdiLoading} from "@mdi/js";
import Icon from "@mdi/react";
import {useNavigate} from "react-router-dom";

function RecipeDetail(props) {

    const [cookbookLoadCall, setCookbookLoadCall] = useState({
        state: "pending",
    });
    const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
        state: "pending",
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8000/recipe/get?id=${props.id}`, {
            method: "GET"
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setCookbookLoadCall({ state: "error", error: responseJson });
            } else {
                console.log(responseJson);
                setCookbookLoadCall({ state: "success", data: responseJson });
            }
        });

        fetch(`http://localhost:8000/ingredient/list`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setIngredientsLoadCall({state: "error", error: responseJson});
            } else {
                setIngredientsLoadCall({state: "success", data: responseJson});
            }
        });
    }, []);

    function handleRedirect() {
        navigate("/recipeList");
    }

    function getChild() {
        switch (`${cookbookLoadCall.state}-${ingredientsLoadCall.state}`) {
            case "pending-pending":
                return (
                    <div>
                        <Icon size={2} path={mdiLoading} spin={true} />
                    </div>
                );
            case "success-success":
                return(
                    <div className="d-flex justify-content-center" style={{ paddingTop: "10px" }}>
                        <Card style={{ width: '30rem' }} className="mb-3">
                            <CardTitle className="text-center">{cookbookLoadCall.data.name}</CardTitle>
                            <ul>
                                {cookbookLoadCall.data.ingredients.map((ingredient) => (
                                    <li key={ingredient.id}
                                        style={{textAlign: "left"}}>{ingredientsLoadCall.data.find(ing => ing["id"] === ingredient.id).name + ` (${ingredient.amount} ${ingredient.unit})`}</li>
                                ))}
                            </ul>
                            <CardBody>{cookbookLoadCall.data.description}</CardBody>
                            <CardImg variant="bottom" src="https://www.pigy.cz/wp-content/uploads/2017/06/cockovy-salat_1-450x245.jpg" style={{ padding: "10px" }}
                            />
                            <Button variant="outline-primary"
                                    class="btn btn-success btn-sm"
                                    onClick={handleRedirect}
                                    style={{ padding: "10px"}}>Zpět</Button>
                        </Card>
                    </div>
                );
            case "error-error":
                return (
                    <div>
                        <div>Nepodařilo se načíst data.</div>
                        <br />
                        <pre>{JSON.stringify(cookbookLoadCall.error, null, 2)}</pre>
                    </div>
                );
            case "error-success":
                return (
                    <div>
                        <div>Nepodařilo se načíst data o receptu s id: {props.id}.</div>
                        <br />
                        <pre>{JSON.stringify(cookbookLoadCall.error, null, 2)}</pre>
                    </div>
                );
            default:
                return null;
        }
    }

    return getChild();
}

export default RecipeDetail;