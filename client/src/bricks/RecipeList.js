import React, {useMemo, useState} from 'react';
import {Button, Form, Navbar} from "react-bootstrap";
import Icon from "@mdi/react";
import {mdiMagnify, mdiTable, mdiViewGridOutline} from "@mdi/js";
import RecipeTableList from "./RecipeTableList";
import RecipeGridList from "./RecipeGridList";

function RecipeList(props) {

    const [viewType, setViewType] = useState("Velká karta");
    const isGrid = viewType === "Velká karta" || viewType === "Ingredience";
    const viewTypes = ["Velká karta", "Ingredience", "Tabulka"]

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
            <Navbar collapseOnSelect expand="sm" bg="light">
                <div className="container-fluid">
                    <Navbar.Brand>Seznam receptů</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse style={{ justifyContent: "right" }}>
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
                                    className={"d-none d-md-block"}
                                    variant="outline-primary"
                                    onClick={nextViewType}
                                >
                                    <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} />{" "}
                                    {viewType}
                                </Button>
                            </Form>
                        </div>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            <div>
                {filteredRecipeList.length ? (
                        <div className="container">
                            <div className={"d-block d-md-none"}>
                                <RecipeGridList recipeList={filteredRecipeList} />
                            </div>
                            <div className={"d-none d-md-block"}>
                                {isGrid ? (
                                    <RecipeGridList recipeList={filteredRecipeList} smallCards={viewType === "Ingredience"} />
                                ) : (
                                    <RecipeTableList recipeList={filteredRecipeList} />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{margin: "16px auto", textAlign: "center"}}>
                            Nejsou žádné recepty ke zobrazení
                        </div>
                    )}
            </div>
        </div>
    );
}

                export default RecipeList;