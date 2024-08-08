import React from 'react';
import {Card} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function Recipe(props) {
    return (
            <Card style={{ width: '26rem', margin: '16px'}}>
                <Card.Img variant="top"
                          //src={props.recipe.imgUri}
                          src={"https://www.pigy.cz/wp-content/uploads/2017/06/cockovy-salat_1-450x245.jpg"}/>
                <Card.Body>
                    <Card.Title>{props.recipe.name}</Card.Title>
                    <Card.Text>{props.recipe.description}</Card.Text>
                </Card.Body>
            </Card>
    )
}
export default Recipe;