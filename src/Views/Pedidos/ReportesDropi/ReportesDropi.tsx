import React, { useState } from 'react'
import { ModalSeleccionReporte } from './ModalSeleccionReporte'

export const ReportesDropi: React.FC = () => {

    const [isViewModalSeleccionarReporte, setisViewModalSeleccionarReporte] = useState(false)

    const cambiarVisibilidadModal = () => {
        setisViewModalSeleccionarReporte(!isViewModalSeleccionarReporte)
    }

    return (
        <>
            <div>
                <p
                    className='px-4 py-2 mx-2 text-white duration-300 bg-blue-500 rounded cursor-pointer hover:bg-blue-600'
                    onClick={cambiarVisibilidadModal}
                >
                    Generar reportes dropi
                </p>
            </div>

            {
                isViewModalSeleccionarReporte && (
                    <ModalSeleccionReporte
                        setisViewModalSeleccionarReporte={setisViewModalSeleccionarReporte}
                    />
                )
            }
        </>
    )
}
