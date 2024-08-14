import React, {useMemo, useState} from 'react';
import {Button, Form, Navbar} from "react-bootstrap";
import Icon from "@mdi/react";
import {mdiMagnify, mdiTable, mdiViewGridOutline} from "@mdi/js";
import RecipeTableList from "./RecipeTableList";
import RecipeGridList from "./RecipeGridList";

function RecipeList(props) {

    const [viewType, setViewType] = useState("grid");
    const isGrid = viewType === "grid";
    const [searchBy, setSearchBy] = useState("");

    function handleSearch(event) {
        event.preventDefault();
        setSearchBy(event.target["searchInput"].value);
    }

    function handleSearchDelete(event) {
        if (!event.target.value) setSearchBy("");
    }

    const filteredRecipeList = useMemo(() => {
        return props.recipeList.filter((recipe) => {
            console.log("filtr")
            return (
                recipe.name.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase())
                ||
                recipe.description.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase())
            );
        });
    }, [searchBy]);

    return (
        <div>
            <Navbar bg="light">
                <div className="container-fluid">
                    <Navbar.Brand>Seznam receptů</Navbar.Brand>
                    <div>
                        <Form className="d-flex" onSubmit={handleSearch}>
                            <Form.Control
                                id={"searchInput"}
                                style={{ maxWidth: "150px" }}
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                onChange={handleSearchDelete}
                            />
                            <Button
                                style={{ marginRight: "8px" }}
                                variant="outline-success"
                                type="submit"
                            >
                                <Icon size={1} path={mdiMagnify} />
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() =>
                                    setViewType((currentState) => {
                                        if (currentState === "grid") return "table";
                                        else return "grid";
                                    })
                                }
                            >
                                <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} />{" "}
                                {isGrid ? "Tabulka" : "Grid"}
                            </Button>
                        </Form>
                    </div>
                </div>
            </Navbar>
            {isGrid ? (
                <RecipeGridList recipeList={filteredRecipeList} />
            ) : (
                <RecipeTableList recipeList={filteredRecipeList} />
            )}
        </div>
    )
}

export default RecipeList;