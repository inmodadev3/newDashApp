import React, { useContext ,useEffect } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../Utils/UseContextProviders'
import { SubMenuSections } from '../../../Components/MenuLateral/MenuSections'

export const Permisos_Empleados:React.FC = () => {

    const {setSubmenuSelected} = useContext(MenuSelectedContext)

    useEffect(()=>{
        setSubmenuSelected(SubMenuSections.PERMISOS_EMPLEADO)
    },[])
  return (
    <AppLayout>
        <label>
            <p>Seleccione un usuario</p>
            <select>
                <option>ANDRES DAVID OROZCO MANRIQUE</option> 
                <option>ANDRES DAVID OROZCO MANRIQUE</option> 
                <option>ANDRES DAVID OROZCO MANRIQUE</option> 
            </select>
        </label>
    </AppLayout>
  )
}
