import React, { useContext, useEffect } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../Utils/UseContextProviders'
import { DescargarFormato } from '../../../Components/Compras/Cargar_Contenedor/DescargarFormato'
import { SubirDatosRaggi } from '../../../Components/Compras/Cargar_Contenedor/SubirDatosRaggi'

export const CargarContenedor:React.FC = () => {

    const { setMenuSelected,setSubmenuSelected } = useContext(MenuSelectedContext)

    useEffect(()=>{
        setMenuSelected(0)
        setSubmenuSelected(31)
    },[])

    

  return (
    <AppLayout>
        <DescargarFormato/>
        <SubirDatosRaggi/>
    </AppLayout>
  )
}
