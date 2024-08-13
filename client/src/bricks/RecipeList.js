import React, {useState} from 'react';
import {Button, Navbar} from "react-bootstrap";
import Icon from "@mdi/react";
import {mdiTable, mdiViewGridOutline} from "@mdi/js";
import RecipeTableList from "./RecipeTableList";
import RecipeGridList from "./RecipeGridList";

function RecipeList(props) {

    const [viewType, setViewType] = useState("grid");
    const isGrid = viewType === "grid";

    return (
        <div>
            <Navbar bg="light">
                <div className="container-fluid">
                    <Navbar.Brand>Seznam receptů</Navbar.Brand>
                    <Button variant="outline-primary"
                            onClick={() =>
                                setViewType((currentState) => {
                                    if (currentState === "grid") return "table";
                                    else return "grid";
                                })
                            }>
                        <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} />{" "}
                        {isGrid ? "Tabulka" : "Grid"}
                    </Button>
                </div>
            </Navbar>
            {isGrid ? (
                <RecipeGridList recipeList={props.recipeList} />
            ) : (
                <RecipeTableList recipeList={props.recipeList} />
            )}
        </div>
    )
}

export default RecipeList;