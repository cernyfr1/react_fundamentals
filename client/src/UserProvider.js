import { createContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const [recipesRefreshIndex, setRecipesRefreshIndex] = useState(0);
    const value = {isAuthenticated, setIsAuthenticated, recipesRefreshIndex, setRecipesRefreshIndex};

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;