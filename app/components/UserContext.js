import React, { createContext, useContext, useState } from 'react';

// Create the UserContext
const UserContext = createContext();

// Create a custom hook for easier access to the context
export const useUser = () => useContext(UserContext);

// Create a provider component
export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        username: '@lorem',
        firstName: 'lorem_username',
        lastName: '',
        father: 'God',
        current: 'abiy',
        userId: 100, //userId: undefined,
        recentDisabled: "666",
        profile: "https://png.pngtree.com/png-clipart/20230511/ourmid/pngtree-isolated-cat-on-white-background-png-image_7094927.png"

    });

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};
