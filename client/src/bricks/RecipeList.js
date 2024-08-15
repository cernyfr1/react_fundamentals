import React, {useMemo, useState} from 'react';
import {Button, Form, Navbar} from "react-bootstrap";
import Icon from "@mdi/react";
import {mdiMagnify, mdiTable, mdiViewGridOutline} from "@mdi/js";
import RecipeTableList from "./RecipeTableList";
import RecipeGridList from "./RecipeGridList";

function RecipeList(props) {

    const [viewType, setViewType] = useState("Velká karta");
    const isGrid = viewType.includes("karta");
    const viewTypes = ["Velká karta", "Malá karta", "Tabulka"]

    function nextViewType() {
        const currentIndex = viewTypes.indexOf(viewType);
        if (currentIndex === viewTypes.length - 1) {
            setViewType(viewTypes[0])
        } else {
            setViewType(viewTypes[currentIndex + 1]);
        }
    }

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
                                onClick={nextViewType}
                            >
                                <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} />{" "}
                                {viewType}
                            </Button>
                        </Form>
                    </div>
                </div>
            </Navbar>
            {isGrid ? (
                <RecipeGridList recipeList={filteredRecipeList} smallCards={viewType === "Malá karta"} />
            ) : (
                <RecipeTableList recipeList={filteredRecipeList} />
            )}
        </div>
    )
}

export default RecipeList;