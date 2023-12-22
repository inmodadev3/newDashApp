import React from 'react'
import { Permisos } from '../../Views/Administrador/Permisos_Empleados/Permisos_Empleados'
import './Styles.css'

type SwitchProps = {
    permiso: Permisos;
    handleSetPermission: (id: number,checked:boolean) => void;
    checked:boolean
  };
  

export const Switch: React.FC<SwitchProps> = ({ permiso, handleSetPermission,checked }) => {

    const handleChangeSwitch = () => {
        handleSetPermission(permiso.id_permiso , checked);
      };    

    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={handleChangeSwitch}
            />
            <span className="slider round"></span>
        </label>

    )
}
