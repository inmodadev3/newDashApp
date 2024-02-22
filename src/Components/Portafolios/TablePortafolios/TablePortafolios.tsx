import React from 'react'
import './stylesTablePortafolio.css'
import { MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import moment from 'moment';

type PropsTercero = {
    stridCedula: string,
    strNombre: string
}

interface IDataPropsPortafolio {
    Estado: string
    Nombre_tercero: string,
    StrIdTercero: string
    Viaja: string
    ciudad: string
    ultima_Compra: number
}

type Props = {
    data: IDataPropsPortafolio[]
    setviewGestionesCliente: React.Dispatch<React.SetStateAction<boolean>>
    setidClienteGestiones: React.Dispatch<React.SetStateAction<PropsTercero>>
    setviewInfoCliente: React.Dispatch<React.SetStateAction<boolean>>
}

export const TablePortafolios: React.FC<Props> = ({ data, setviewGestionesCliente, setidClienteGestiones, setviewInfoCliente }) => {
    return (
        <table className='table table_portafolio'>
            <thead>
                <tr>
                    <th>Estado</th>
                    <th>Identificacion</th>
                    <th>Nombre Cliente</th>
                    <th>Viaja</th>
                    <th>Ultima Compra</th>
                    <th>Ciudad</th>
                    <th>Gestiones</th>
                    <th>Info Cliente</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((tercero) => (
                        <tr key={tercero.StrIdTercero}>
                            <td className={`estado`}>{tercero.Estado}</td>
                            <td>{tercero.StrIdTercero}</td>
                            <td>{tercero.Nombre_tercero}</td>
                            <td style={{ textAlign: 'center' }}>{tercero.Viaja}</td>
                            <td>{tercero.ultima_Compra !== null ? moment(tercero.ultima_Compra).format('DD-MM-yy') : ""}</td>
                            <td>{tercero.ciudad}</td>
                            <td style={{ textAlign: 'center' }}><span className='portafolio_options' onClick={() => {
                                setviewGestionesCliente(true)
                                setidClienteGestiones({
                                    strNombre:tercero.Nombre_tercero,
                                    stridCedula: tercero.StrIdTercero
                                });
                            }}><MdOutlineManageAccounts size={28} className="optionP" /></span></td>
                            <td style={{ textAlign: 'center' }}><span className='portafolio_options' onClick={() => {
                                setviewInfoCliente(true)
                                setidClienteGestiones({
                                    strNombre:tercero.Nombre_tercero,
                                    stridCedula: tercero.StrIdTercero
                                });
                            }}><AiOutlineUser size={28} className="optionP" /></span></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
