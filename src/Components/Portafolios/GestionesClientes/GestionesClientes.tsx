import React, { useEffect, useState } from 'react'
import './GestionesClientes.css'
import axios from '../../../Utils/BaseUrlAxio'
import moment from 'moment'
import { AgregarGestion } from './AgregarGestion'
import { ModalsLayout } from '../../Modals/ModalsLayout'

type PropsGestiones = {
    cedula: string
    setviewGestionesCliente: React.Dispatch<React.SetStateAction<boolean>>
    idLogin: number
}

interface IDataGestionesClientes {
    dtFechaGestion: string
    intIdGestion: number
    intTipoGestion: number
    strNombreEmpleado: string
    strObservacion: string
}

export const GestionesClientes: React.FC<PropsGestiones> = ({ cedula, setviewGestionesCliente, idLogin }) => {
    const [gestionesCliente, setgestionesCliente] = useState<IDataGestionesClientes[]>([])

    useEffect(() => {
        ConsultarGestionesClientes()
    }, [cedula])


    const ConsultarGestionesClientes = () => {
        axios.get(`/portafolios/gestiones/${cedula}`)
            .then((response) => {
                setgestionesCliente(response.data.data)
            }).catch((err) => {
                console.error(err)
            })
    }

    const Gestiones = ["Llamada", "Envio de Fotos", "Envio de Portafolio", "Venta en sala", "Venta en Dash", "Visita a cliente", "Pos venta", "Deshabilitar", "Varios","Mensajes"]


    return (
        <ModalsLayout CloseEvent={setviewGestionesCliente}>
            <div className='Gestiones_info_Container'>
                <AgregarGestion cedula={cedula} idLogin={idLogin} ConsultarGestionesClientes={ConsultarGestionesClientes} />
                <div className='containerTableGestiones'>
                    <table className='table tableGestiones'>
                        <thead>
                            <tr>
                                <th>Vendedor</th>
                                <th>Gestion</th>
                                <th>Tipo</th>
                                <th>Fecha</th>
                                {/* <th>Acciones</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                gestionesCliente.map((gestion) => (
                                    <tr key={gestion.intIdGestion}>
                                        <td>{gestion.strNombreEmpleado}</td>
                                        <td>{gestion.strObservacion}</td>
                                        <td>{Gestiones[gestion.intTipoGestion]}</td>
                                        <td>{moment(gestion.dtFechaGestion).format('DD-MM-yy hh:mm:ss')}</td>
                                        {/* <td ><span><CiEdit size={30} cursor={"pointer"} onClick={() => { console.log(fechaFormated) }} /></span></td> */}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </ModalsLayout>
    )
}
