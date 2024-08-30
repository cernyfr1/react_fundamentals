import React, {useEffect, useState} from "react";
import Recipe from "./Recipe";
import Icon from "@mdi/react";
import {mdiLoading} from "@mdi/js";

function RecipeGridList(props) {

    const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
        state: "pending",
    });

    useEffect(() => {
        fetch(`http://localhost:8000/ingredient/list`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setIngredientsLoadCall({ state: "error", error: responseJson });
            } else {
                setIngredientsLoadCall({ state: "success", data: responseJson });
            }
        });
    }, []);

    function filterIngredientsForRecipe(recipe) {
        const recipeIngredientIds = recipe.ingredients.map(ingredient => ingredient.id);

        return ingredientsLoadCall.data.filter(ingredient =>
            recipeIngredientIds.includes(ingredient.id)
        ).sort((a, b) => recipeIngredientIds.indexOf(a.id) - recipeIngredientIds.indexOf(b.id));
    }

    function getChild() {
        switch (ingredientsLoadCall.state) {
            case "pending":
                return (
                    <div className="loading">
                        <Icon size={2} path={mdiLoading} spin={true} />
                    </div>
                );
            case "success":
                return (
                    <div className="row">
                        {props.recipeList.map((recipe) => {
                            return (
                                <div
                                    className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                                    style={{ paddingBottom: "16px" }}
                                >
                                    <Recipe key={recipe.id} recipe={recipe} smallCard={props.smallCards} filteredIngredients={filterIngredientsForRecipe(recipe)}/>
                                </div>
                            );
                        })}
                    </div>
                );
            case "error":
                return (
                    <div className="error">
                        <div>Nepodařilo se načíst data o třídě.</div>
                        <br />
                        <pre>{JSON.stringify(ingredientsLoadCall.error, null, 2)}</pre>
                    </div>
                );
            default:
                return null;
        }
    }

    return <div>{getChild()}</div>;
}

export default RecipeGridList;