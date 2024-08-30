import Icon from "@mdi/react";
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {mdiLoading, mdiPlus} from "@mdi/js";
import React, {useEffect, useState} from 'react'

function AddRecipeModal({name, imgUri, description, ingredientId, ingredientQuantity, quantityMeasure }) {
    const [isModalShown, setShow] = useState(false);

    const handleShowModal = () => setShow(true);
    const handleCloseModal = () => setShow(false);
    const [validated, setValidated] = useState(false);
    const [addRecipeCall, setAddRecipeCall] = useState({state: 'inactive'});

    const [formData, setFormData] = useState({
        name: name,
        imgUri: imgUri,
        description: description,
        ingredientId: ingredientId,
        ingredientQuanity: ingredientQuantity,
        quantityMeasure: quantityMeasure,
    });

    console.log(formData)
    console.log(name);

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
        console.log(JSON.stringify(payload));
        const body = {
            name: payload.name,
            description: payload.description,
            imgUri: payload.imgUri,
            ingredients: [
                {
                    id: payload.ingredientId,
                    amount: payload.ingredientQuanity,
                    unit: payload.quantityMeasure
                }
            ]
    }
        const res = await fetch(`http://localhost:8000/recipe/create`, {
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

        console.log(payload);
    };

    const [cookbookLoadCall, setCookbookLoadCall] = useState({
        state: "",
    });

    useEffect(() => {
        if (isModalShown) fetchData();
    }, [isModalShown]);

    const fetchData = async () => {
        setCookbookLoadCall({ state: "pending" });

        const res = await fetch(`http://localhost:8000/ingredient/list`);
        const data = await res.json();

        if (res.status >= 400) {
            setCookbookLoadCall({ state: "error", error: data });
        } else {
            setCookbookLoadCall({ state: "success", data });
            //setField("ingredientId", data[0].id);
        }
    };

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

                                <Row>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Ingredience</Form.Label>
                                        <Form.Select
                                            value={formData.ingredientId}
                                            required={true}
                                            onChange={(e) => setField("ingredientId", e.target.value)}
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

                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Množství</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.ingredientQuanity}
                                            required={true}
                                            onChange={(e) => setField("ingredientQuanity", parseInt(e.target.value))}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Toto pole nesmí být prázdné.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Jednotka</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.quantityMeasure}
                                            required={true}
                                            onChange={(e) => setField("quantityMeasure", e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Toto pole nesmí být prázdné.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                </Row>

                            </Modal.Body>
                            <Modal.Footer>
                                <div>
                                    {addRecipeCall.state === 'error' &&
                                        <div
                                            className="text-danger">Error: {addRecipeCall.error.errorMessage}</div>
                                    }
                                </div>
                                <div className="d-flex flex-row gap-2">
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Zavřít
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={addRecipeCall.state === 'pending'}>
                                        { addRecipeCall.state === 'pending' ? (
                                            <Icon size={0.8} path={mdiLoading} spin={true} />
                                        ) : (
                                            "Přidat"
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
                <Icon path={mdiPlus} size={1} />
                Přidat recept
            </Button>
        </>
    )
}

export default AddRecipeModal;