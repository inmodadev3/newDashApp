import React, { createContext, useState } from 'react';

export const MenuSelectedContext = createContext<{
    menuSelected: number;
    setMenuSelected: React.Dispatch<React.SetStateAction<number>>;
    submenuSelected:number
    setSubmenuSelected: React.Dispatch<React.SetStateAction<number>>;

}>({
    menuSelected: 1,
    setMenuSelected: () => { },
    submenuSelected:1,
    setSubmenuSelected: () => { }
});

interface MenuProps {
    children: any
}

export const MenuSelectedProvider: React.FC<MenuProps> = ({ children }) => {
    const [menuSelected, setMenuSelected] = useState(1);
    const [submenuSelected, setSubmenuSelected] = useState(1)

    return (
        <MenuSelectedContext.Provider value={{ menuSelected, setMenuSelected,submenuSelected,setSubmenuSelected }}>
            {children}
        </MenuSelectedContext.Provider>
    );
};