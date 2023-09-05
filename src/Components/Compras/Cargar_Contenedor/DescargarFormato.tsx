import React from 'react'
import './stylesDescargarFormato.css'
import { ExportarExcel } from '../../../Utils/Helpers'

export const DescargarFormato: React.FC = () => {

    const DescargarFormatoContenedor = () => {
        const data = [ ['Caja', 'Referencia', 'Descripcion', 'Cantidad', 'Unidad de Medida', 'Valor', 'Color', 'Dimension', 'CxU', 'Estilo', 'Cantidad por paca', 'Material']]
        ExportarExcel(data,"FORMATO CONTENEDOR","Formato_Contenedor")
    }


    return (
        <div className='flex justify-center lg:justify-end lg:px-4 lg:py-2'>
            <button className='bg-[#de2479] px-6 py-3 text-white rounded hover:scale-110 transition-all duration-300' onClick={DescargarFormatoContenedor}>Descargar formato contenedor</button>
        </div>
    )
}
