import React, {useContext, useEffect, useState} from 'react';
import {Button, Card} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import UserContext from "../UserProvider";
import AddOrEditRecipeModal from "./AddOrEditRecipeModal";
import Icon from "@mdi/react";
import {mdiTrashCan, mdiTrashCanOutline} from "@mdi/js";

function Recipe(props) {

    const [isExpanded, setIsExpanded] = useState(!props.smallCard);
    const maxLines = 3;
    const {isAuthenticated} = useContext(UserContext);
    const [addOrEditRecipeShow, setAddOrEditRecipeShow] = useState(false);

    useEffect(() => {
        setIsExpanded(!props.smallCard)
    }, [props.smallCard]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const truncatedText = (text) => {
        if (!isExpanded) {
            return (
                <span style={{
                    display: '-webkit-box',
                    WebkitLineClamp: maxLines,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {text}
                </span>
            );
        }
        return <span>{text}</span>;
    };


    return (
        <Card style={{ margin: '16px' }}>
            <Card.Img
                variant="top"
                //src={props.recipe.imgUri}
                src="https://www.pigy.cz/wp-content/uploads/2017/06/cockovy-salat_1-450x245.jpg"
            />
            <Card.Body>
                <Card.Title>{props.recipe.name}</Card.Title>
                <Card.Text>
                    {truncatedText(props.recipe.description)}
                    {props.recipe.description.length > 100 && !isExpanded && (
                        <span
                            onClick={toggleExpand}
                            style={{ color: 'blue', cursor: 'pointer' }}
                        >
                            {" "}See more
                        </span>
                    )}
                    {isExpanded && (
                        <span
                            onClick={toggleExpand}
                            style={{ color: 'blue', cursor: 'pointer' }}
                        >
                            {" "}See less
                        </span>
                    )}
                </Card.Text>
                {props.smallCard && (
                    <ul>
                        {props.filteredIngredients.map((ingredient, index) => (
                            <li key={ingredient.id} style={{textAlign:"left"}}>{ingredient.name + ` (${props.recipe.ingredients[index].amount} ${props.recipe.ingredients[index].unit})`}</li>
                        ))}
                    </ul>
                )}
                {isAuthenticated && (
                    <AddOrEditRecipeModal
                        show={addOrEditRecipeShow}
                        setAddGradeShow={setAddOrEditRecipeShow}
                        recipeId={props.recipe.id}
                        name={props.recipe.name}
                        imgUri={props.recipe.imgUri}
                        description={props.recipe.description}
                        ingredientsList={props.recipe.ingredients}
                    />
                )}
            </Card.Body>
        </Card>
    )
}
export default Recipe;