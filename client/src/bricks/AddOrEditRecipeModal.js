import Icon from "@mdi/react";
import {Button, Col, Form, FormGroup, Modal, Row} from 'react-bootstrap';
import {mdiLoading, mdiPlus, mdiTrashCan} from "@mdi/js";
import React, {useEffect, useState} from 'react'

function AddOrEditRecipeModal({recipeId, name, imgUri, description, ingredientsList }) {
    const [isModalShown, setShow] = useState(false);

    const handleShowModal = () => setShow(true);
    const handleCloseModal = () => setShow(false);
    const [validated, setValidated] = useState(false);
    const [addRecipeCall, setAddRecipeCall] = useState({state: 'inactive'});
    const [ingredients, setIngredients] = useState(ingredientsList ? ingredientsList : []);

    const [formData, setFormData] = useState({
        name: name,
        imgUri: imgUri,
        description: description,
        ingredients: ingredients
    });

    const setField = (name, val) => {
        return setFormData((formData) => {
            const newData = { ...formData };
            newData[name] = val;
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget;

        const payload = {
            ...formData
        };

        if (!form.checkValidity()) {
            setValidated(true);
            return;
        }

        setAddRecipeCall({state: 'pending'});
        const body = {
            name: payload.name,
            description: payload.description,
            imgUri: payload.imgUri,
            ingredients: ingredients
        }
        if (recipeId) {body.id = recipeId;}

        const res = await fetch(`http://localhost:8000/recipe/${recipeId ? "update" : "create"}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (res.status >= 400) {
            setAddRecipeCall({ state: "error", error: data });
        } else {
            setAddRecipeCall({ state: "success", data });
            handleCloseModal();
        }

    };

    const [cookbookLoadCall, setCookbookLoadCall] = useState({
        state: "",
    });

    useEffect(() => {
        if (isModalShown) fetchData();
    }, [isModalShown, ingredients]);

    const fetchData = async () => {
        setCookbookLoadCall({ state: "pending" });

        const res = await fetch(`http://localhost:8000/ingredient/list`);
        const data = await res.json();

        if (res.status >= 400) {
            setCookbookLoadCall({ state: "error", error: data });
        } else {
            setCookbookLoadCall({ state: "success", data });
        }
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, [field]: value } : ingredient
        );
        setIngredients(updatedIngredients);
        setField("ingredients", ingredients);
    };

    const handleAddIngredient = () => {
        let updatedIngredients = ingredients;
        updatedIngredients.push({id: cookbookLoadCall.data[0].id, amount: null, unit: ""})
        setIngredients(updatedIngredients);
        setField("ingredients", ingredients);
    }

    const handleIngredientDelete = (idToRemove) => {
        const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== idToRemove);
        setIngredients(updatedIngredients);
        setField("ingredients", ingredients);
    }

    function ingredientSelector() {
        return (
            <>
                {ingredients.map((ingredient, index) => (
                    <Row key={ingredient.id}>
                        <Form.Group as={Col} xs="auto" className="mb-3" style={{paddingRight: "0"}}>
                            {index === 0 && (<Form.Label>Ingredience</Form.Label>)}
                            <Form.Select
                                value={ingredient.id}
                                required={true}
                                onChange={(e) => handleIngredientChange(index, 'id', e.target.value)}
                            >
                                {cookbookLoadCall.data.map((ingredientOption) => (
                                    <option value={ingredientOption.id} key={ingredientOption.id}>
                                        {ingredientOption.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Toto pole nesmí být prázdné.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" style={{padding: "0"}}>
                            {index === 0 && (<Form.Label>Množství</Form.Label>)}
                            <Form.Control
                                type="number"
                                value={ingredient.amount}
                                required={true}
                                onChange={(e) => handleIngredientChange(index, 'amount', parseInt(e.target.value))}
                            />
                            <Form.Control.Feedback type="invalid">
                                Toto pole nesmí být prázdné.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" style={{padding: "0"}}>
                            {index === 0 && (<Form.Label>Jednotka</Form.Label>)}
                            <Form.Control
                                type="text"
                                value={ingredient.unit}
                                required={true}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Toto pole nesmí být prázdné.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} xs="auto" className="mb-3" style={{paddingLeft: "0"}}>
                            {index === 0 && (<Form.Label>
                                <span style={{display: "inline-block", height: "100%", visibility: "hidden"}}>X</span>
                            </Form.Label>)}
                            <div>
                                <Button variant={"danger"} onClick={() => handleIngredientDelete(ingredient.id)}>
                                    <Icon size={0.8} path={mdiTrashCan}></Icon>
                                </Button>
                            </div>

                        </Form.Group>
                    </Row>
                ))}
                <Button variant="secondary" onClick={handleAddIngredient} >
                    Přidat ingredienci
                </Button>
            </>
        )
    }

    return (
        <>
            {cookbookLoadCall.state === "pending" && (
                <div className="d-flex flex-column justify-content-center align-items-center mt-5 mb-5">
                    <Icon size={2} path={mdiLoading} spin={true} />
                </div>
            )}

            {cookbookLoadCall.state === "success" && (
                <div style={{ maxHeight: "55vh", overflow: "auto" }}>
                    <Modal show={isModalShown} onHide={handleCloseModal}>
                        <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Přidat recept</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Název receptu</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        required={true}
                                        onChange={(e) => setField("name", e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Toto pole nesmí být prázdné.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Url adresa obrázku</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.imgUri}
                                        required={true}
                                        onChange={(e) => setField("imgUri", e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Toto pole nesmí být prázdné.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Postup</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        value={formData.description}
                                        required={true}
                                        onChange={(e) => setField("description", e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Toto pole nesmí být prázdné.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                {ingredientSelector(ingredients)}

                            </Modal.Body>
                            <Modal.Footer>
                                <div>
                                    {addRecipeCall.state === 'error' &&
                                        <div
                                            className="text-danger">Error: {addRecipeCall.error.errorMessage}</div>
                                    }
                                </div>
                                <div className="d-flex flex-row gap-2">
                                    <Button variant={"danger"}>
                                        <Icon size={0.8} path={mdiTrashCan}></Icon>
                                    </Button>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Zavřít
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={addRecipeCall.state === 'pending'}>
                                        { addRecipeCall.state === 'pending' ? (
                                            <Icon size={0.8} path={mdiLoading} spin={true} />
                                        ) : (
                                            name ? "Upravit" : "Přidat recept"
                                        )}
                                    </Button>
                                </div>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                </div>
            )}

            {cookbookLoadCall.state === "error" && (
                <div className="d-flex flex-column justify-content-center align-items-center mt-5 mb-5">
                    <div>
                        Nepodařilo se načíst data.
                    </div>
                    <br />
                    <pre>
                        {JSON.stringify(cookbookLoadCall.error, null, 2)}
                    </pre>
                </div>
            )}

            <Button
                style={{ float: "right" }}
                variant="outline-primary"
                class="btn btn-success btn-sm"
                onClick={handleShowModal}
            >
                {!name && <Icon path={mdiPlus} size={1} />}
                {name ? "Upravit" : "Přidat recept"}
            </Button>
        </>
    )
}

export default AddOrEditRecipeModal;