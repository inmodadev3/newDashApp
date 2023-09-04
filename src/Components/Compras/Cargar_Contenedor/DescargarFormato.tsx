import React from 'react'
import './stylesDescargarFormato.css'
import { ExportarExcel } from '../../../Utils/Helpers'

export const DescargarFormato: React.FC = () => {

    const DescargarFormatoContenedor = () => {
        const data = [ ['Caja', 'Referencia', 'Descripcion', 'Cantidad', 'Unidad de Medida', 'Valor', 'Color', 'Dimension', 'CxU', 'Estilo', 'Cantidad por paca', 'Material']]

        ExportarExcel(data,"FORMATO CONTENEDOR","Formato_Contenedor")
    }


    return (
        <div className='btnContainer'>
            <button onClick={DescargarFormatoContenedor}>Descargar formato contenedor</button>
        </div>
    )
}
