import RecipeDetailBrick from "../bricks/RecipeDetail";
import {useSearchParams} from "react-router-dom";

function RecipeDetail() {

    let [searchParams] = useSearchParams();

    const recipeId = searchParams.get("id");

    if (!recipeId) return <></>;
    return <RecipeDetailBrick id={recipeId} />;

}

export default RecipeDetail;