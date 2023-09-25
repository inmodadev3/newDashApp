import React from 'react'
import './stylesDescargarFormato.css'
import { Excel_Formatos } from '../../../Utils/excelTemplates/ExcelFormats'

export const DescargarFormato: React.FC = () => {

    const DescargarFormatoContenedor = () => {
        const data = [ ['Caja', 'Referencia', 'Descripcion', 'Cantidad', 'Unidad de Medida', 'Valor', 'Color', 'Dimension', 'CxU', 'Estilo', 'Cantidad por paca', 'Material']]
        Excel_Formatos(data,"FORMATO CONTENEDOR","Formato_Contenedor")
    }


    return (
        <div className='absolute w-auto lg:right-4 lg:top-3'>
            <button className='bg-[#de2479] px-6 py-3 text-white rounded hover:scale-110 transition-all duration-300' onClick={DescargarFormatoContenedor}>Descargar formato contenedor</button>
        </div>
    )
}
