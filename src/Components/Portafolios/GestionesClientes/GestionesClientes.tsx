import React, { useEffect, useState } from 'react'
import './GestionesClientes.css'
import axios from '../../../Utils/BaseUrlAxio'
import moment from 'moment'
import { AgregarGestion } from './AgregarGestion'
import { ModalsLayout } from '../../Modals/ModalsLayout'
import { IDataPropsPortafolio } from '../../../Views/Portafolios/Portafolios'


type PropsTercero = {
    stridCedula: string,
    strNombre: string
}

type PropsGestiones = {
    cedula: PropsTercero
    setviewGestionesCliente: React.Dispatch<React.SetStateAction<boolean>>
    idLogin: number
    setdatosClientes: React.Dispatch<React.SetStateAction<IDataPropsPortafolio[] | null>> 
    datosClientes : IDataPropsPortafolio[] | null
}

interface IDataGestionesClientes {
    dtFechaGestion: string
    intIdGestion: number
    intTipoGestion: number
    strNombreEmpleado: string
    strObservacion: string
}

export const GestionesClientes: React.FC<PropsGestiones> = ({ cedula, setviewGestionesCliente, idLogin,setdatosClientes,datosClientes }) => {
    const [gestionesCliente, setgestionesCliente] = useState<IDataGestionesClientes[]>([])
    

    useEffect(() => {
        ConsultarGestionesClientes()
    }, [cedula])


    const ConsultarGestionesClientes = () => {
        axios.get(`/portafolios/gestiones/${cedula.stridCedula}`)
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
                <div className='flex gap-x-11'>
                    <p className='font-semibold'>{cedula.strNombre}</p>
                    <p>{cedula.stridCedula}</p>
                </div>
                <hr/>
                <AgregarGestion datosClientes={datosClientes} setdatosClientes={setdatosClientes} cedula={cedula.stridCedula} idLogin={idLogin} ConsultarGestionesClientes={ConsultarGestionesClientes} />
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
                                        <td>{moment.utc(gestion.dtFechaGestion).local().format('DD-MM-yy hh:mm:ss')}</td>
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
