import Icon from "@mdi/react";
import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {mdiLoading, mdiPlus} from "@mdi/js";
import React, {useEffect, useState} from 'react'

function AddRecipeModal() {
    const [isModalShown, setShow] = useState(false);

    const handleShowModal = () => setShow(true);
    const handleCloseModal = () => setShow(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        ingredientName: "",
        ingredientQuanity: null,
        quantityMeasure: ""
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

        const payload = {
            ...formData
        };

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
                        <Form onSubmit={(e) => handleSubmit(e)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Přidat recept</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Název receptu</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setField("name", e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Postup</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        value={formData.description}
                                        onChange={(e) => setField("description", e.target.value)}
                                    />
                                </Form.Group>

                                <Row>
                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Ingredience</Form.Label>
                                        <Form.Select
                                            value={formData.ingredient}
                                            onChange={(e) => setField("ingredient", e.target.value)}
                                        >
                                            {cookbookLoadCall.data.map((ingredientOption) => (
                                                <option value={ingredientOption.name} key={ingredientOption.id}>
                                                    {ingredientOption.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Množství</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.ingredientQuanity}
                                            onChange={(e) => setField("ingredientQuanity", parseInt(e.target.value))}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} className="mb-3">
                                        <Form.Label>Jednotka</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.quantityMeasure}
                                            onChange={(e) => setField("quantityMeasure", e.target.value)}
                                        />
                                    </Form.Group>

                                </Row>

                            </Modal.Body>
                            <Modal.Footer>
                                <div className="d-flex flex-row gap-2">
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Zavřít
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Vytvořit
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