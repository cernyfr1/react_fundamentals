import React from 'react';
import Recipe from "./Recipe";

function RecipeList(props) {
    function getRecipeList(recipeList) {
        return recipeList.map((recipe) => {
            return <Recipe key={recipe.id} recipe={recipe} />;
        })
    }

    return getRecipeList(props.recipeList);
}

export default RecipeList;