import React, { ReactNode, createContext, useState } from 'react';

interface Permiso {
    id_permiso: number;
}

// Definir el contexto PermisosContext
export const PermisosContext = createContext<{
    permisos: Permiso[];
    setPermisos: React.Dispatch<React.SetStateAction<Permiso[]>>;
}>({
    permisos: [{ id_permiso: 1 }],
    setPermisos: () => { },
});

interface MenuProps {
    children: ReactNode;
}

// Definir el proveedor del contexto PermisosContext
export const PermisosProvider: React.FC<MenuProps> = ({ children }) => {
    const [permisos, setPermisos] = useState<Permiso[]>([{ id_permiso: 1 }]);

    return (
        <PermisosContext.Provider value={{ permisos, setPermisos }}>
            {children}
        </PermisosContext.Provider>
    );
};
