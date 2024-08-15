import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import RecipeList from "./bricks/RecipeList";
import {useEffect, useState} from "react";
import Icon from "@mdi/react";
import {mdiLoading} from "@mdi/js";

function App() {

    const [cookbookLoadCall, setCookbookLoadCall] = useState({
        state: "pending",
    });

    useEffect(() => {
        fetch(`http://localhost:8000/recipe/list`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setCookbookLoadCall({ state: "error", error: responseJson });
            } else {
                setCookbookLoadCall({ state: "success", data: responseJson });
            }
        });
    }, []);

    function getChild() {
        switch (cookbookLoadCall.state) {
            case "pending":
                return (
                    <div className="loading">
                        <Icon size={2} path={mdiLoading} spin={true} />
                    </div>
                );
            case "success":
                return (
                    <div className="App">
                        <h1>Kuchařka</h1>
                        <h3>Recepty:</h3>
                        <RecipeList recipeList={cookbookLoadCall.data}/>
                    </div>
                );
            case "error":
                return (
                    <div className="error">
                        <div>Nepodařilo se načíst data o třídě.</div>
                        <br />
                        <pre>{JSON.stringify(cookbookLoadCall.error, null, 2)}</pre>
                    </div>
                );
            default:
                return null;
        }
    }

    return <div className="App">{getChild()}</div>;
}

export default App;