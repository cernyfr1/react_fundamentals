import { createContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const value = {isAuthenticated, setIsAuthenticated};

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;