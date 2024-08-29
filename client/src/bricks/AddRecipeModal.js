import Icon from "@mdi/react";
import {Button, Modal} from 'react-bootstrap';
import {mdiClipboardListOutline, mdiPlus} from "@mdi/js";
import React, { useState } from 'react'

function AddRecipeModal() {
    const [isModalShown, setShow] = useState(false);

    const handleShowModal = () => setShow(true);
    const handleCloseModal = () => setShow(false);

    return (
        <>
            <Modal show={isModalShown} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Přidat recept</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

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