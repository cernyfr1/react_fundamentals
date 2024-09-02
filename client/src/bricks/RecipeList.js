import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Button, Form, Navbar} from "react-bootstrap";
import Icon from "@mdi/react";
import {mdiLoading, mdiMagnify, mdiTable, mdiViewGridOutline} from "@mdi/js";
import RecipeTableList from "./RecipeTableList";
import RecipeGridList from "./RecipeGridList";
import AddOrEditRecipeModal from "./AddOrEditRecipeModal";
import UserContext from "../UserProvider";
import {useNavigate} from "react-router-dom";

function RecipeList() {

    let navigate = useNavigate();
    const { isAuthenticated } = useContext(UserContext);
    if (isAuthenticated === undefined) { navigate("/auth") }

    const [viewType, setViewType] = useState("Velká karta");
    const isGrid = viewType === "Velká karta" || viewType === "Ingredience";
    const viewTypes = ["Velká karta", "Ingredience", "Tabulka"]
    const [cookbookLoadCall, setCookbookLoadCall] = useState({ state: "pending" });
    const [addOrEditRecipeShow, setAddOrEditRecipeShow] = useState(false);
    const { recipesRefreshIndex } = useContext(UserContext);


    useEffect(() => {
        fetch(`http://localhost:8000/recipe/list`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setCookbookLoadCall({ state: "error", error: responseJson });
            } else {
                setCookbookLoadCall({ state: "success", data: responseJson });
            }
        });
    }, [recipesRefreshIndex]);

    const [searchBy, setSearchBy] = useState("");

    function handleSearch(event) {
        event.preventDefault();
        setSearchBy(event.target["searchInput"].value);
    }

    function handleSearchDelete(event) {
        if (!event.target.value) setSearchBy("");
    }

    const filteredRecipeList = useMemo(() => {
        if(cookbookLoadCall.state === "success") return cookbookLoadCall.data.filter((recipe) => {
            return (
                recipe.name.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase())
                ||
                recipe.description.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase())
            );
        }); else return [];
    }, [searchBy, cookbookLoadCall]);

    function nextViewType() {
        const currentIndex = viewTypes.indexOf(viewType);
        if (currentIndex === viewTypes.length - 1) {
            setViewType(viewTypes[0])
        } else {
            setViewType(viewTypes[currentIndex + 1]);
        }
    }

    function getChild() {
        switch (cookbookLoadCall.state) {
            case "pending":
                return (
                    <div className="loading">
                        <Icon size={2} path={mdiLoading} spin={true} />
                    </div>
                );
            case "success":
                return (
                    <div>
                        <Navbar collapseOnSelect expand="sm" bg="light">
                            <div className="container-fluid">
                                <Navbar.Brand>Seznam receptů</Navbar.Brand>
                                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                                <Navbar.Collapse style={{justifyContent: "right"}}>
                                    <div>
                                        <Form className="d-flex" onSubmit={handleSearch}>
                                            <Form.Control
                                                id={"searchInput"}
                                                style={{maxWidth: "150px"}}
                                                type="search"
                                                placeholder="Search"
                                                aria-label="Search"
                                                onChange={handleSearchDelete}
                                            />
                                            <Button
                                                style={{marginRight: "8px"}}
                                                variant="outline-success"
                                                type="submit"
                                            >
                                                <Icon size={1} path={mdiMagnify}/>
                                            </Button>
                                            <Button
                                                style={{marginRight: "8px"}}
                                                className={"d-none d-md-block"}
                                                variant="outline-primary"
                                                onClick={nextViewType}
                                            >
                                                <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline}/>{" "}
                                                {viewType}
                                            </Button>
                                            {isAuthenticated && (
                                                <AddOrEditRecipeModal
                                                    show={addOrEditRecipeShow}
                                                    setAddGradeShow={setAddOrEditRecipeShow}
                                                />
                                            )}
                                        </Form>
                                    </div>
                                </Navbar.Collapse>
                            </div>
                        </Navbar>
                        <div>
                            {filteredRecipeList.length ? (
                                <div className="container">
                                    <div className={"d-block d-md-none"}>
                                        <RecipeGridList recipeList={filteredRecipeList}/>
                                    </div>
                                    <div className={"d-none d-md-block"}>
                                        {isGrid ? (
                                            <RecipeGridList recipeList={filteredRecipeList}
                                                            smallCards={viewType === "Ingredience"}
                                                            />
                                        ) : (
                                            <RecipeTableList recipeList={filteredRecipeList}/>
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
            case "error":
                return (
                    <div className="error">
                        <div>Nepodařilo se načíst data.</div>
                        <br/>
                        <pre>{JSON.stringify(cookbookLoadCall.error, null, 2)}</pre>
                    </div>
                );
            default:
                return null;
        }
    }
    return getChild();
}

export default RecipeList;