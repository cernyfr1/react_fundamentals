import React, {useEffect, useState} from 'react';
import {Card} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function Recipe(props) {

    const [isExpanded, setIsExpanded] = useState(!props.smallCard);
    const maxLines = 3;

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
        <Card style={{ width: '26rem', margin: '16px' }}>
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
            </Card.Body>
        </Card>
    )
}
export default Recipe;