import React, { useContext, useEffect } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { DescargarFormato } from '../../../Components/Compras/Cargar_Contenedor/DescargarFormato'
import { SubirDatosRaggi } from '../../../Components/Compras/Cargar_Contenedor/SubirDatosRaggi'
import './styles.css'
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'

export const CargarContenedor: React.FC = () => {

  const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)

  useEffect(() => {
    setMenuSelected(MenuSections.COMPRAS)
    setSubmenuSelected(SubMenuSections.CARGAR_CONTENEDOR )
  }, [])



  return (
    <AppLayout>
      <section className='relative max-h-screen overflow-y-scroll'>
        <DescargarFormato />
        <SubirDatosRaggi />
      </section>
    </AppLayout>
  )
}
