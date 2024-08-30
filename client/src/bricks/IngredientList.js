import React, {useContext, useEffect, useState} from "react";
import Table from "react-bootstrap/Table";
import Icon from "@mdi/react";
import {mdiLoading} from "@mdi/js";
import {useNavigate} from "react-router-dom";
import UserContext from "../UserProvider";

function IngredientList() {

    let navigate = useNavigate();
    const { isAuthenticated } = useContext(UserContext);
    if (isAuthenticated === undefined) { navigate("/auth") }

    const [cookbookLoadCall, setCookbookLoadCall] = useState({
        state: "pending",
    });

    useEffect(() => {
        fetch(`http://localhost:8000/ingredient/list`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setCookbookLoadCall({state: "error", error: responseJson});
            } else {
                setCookbookLoadCall({state: "success", data: responseJson});
            }
        });
    }, []);

    function getChild() {

    switch (cookbookLoadCall.state) {
        case "pending":
            return (
                <div className="loading">
                    <Icon size={2} path={mdiLoading} spin={true}/>
                </div>
            );
        case "success":
            return (
                <Table>
                    <thead>
                    <tr>
                        <th>ID ingredience</th>
                        <th>Název</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cookbookLoadCall.data.map((ingredient) => {
                        return (
                            <tr key={ingredient.id}>
                                <td>{ingredient.id}</td>
                                <td>{ingredient.name}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
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

export default IngredientList;