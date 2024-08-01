import React from 'react'
import './stylesTablePortafolio.css'
import { MdOutlineManageAccounts } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import moment from 'moment';
import { fechaParseada } from '../../../Utils/Helpers';

export type PropsTercero = {
    stridCedula: string,
    strNombre: string
}

interface IDataPropsPortafolio {
    Estado: string
    Nombre_tercero: string,
    StrIdTercero: string
    Viaja: string
    ciudad: string
    barrio: string
    ultima_Compra: number
    ultima_gestion: Date
}

type Props = {
    data: IDataPropsPortafolio[]
    setviewGestionesCliente: React.Dispatch<React.SetStateAction<boolean>>
    setidClienteGestiones: React.Dispatch<React.SetStateAction<PropsTercero>>
    setviewInfoCliente: React.Dispatch<React.SetStateAction<boolean>>
}

export const TablePortafolios: React.FC<Props> = ({ data, setviewGestionesCliente, setidClienteGestiones, setviewInfoCliente }) => {
    return (
        <table className='table text-xs table_portafolio'>
            <thead>
                <tr>
                    <th>Estado</th>
                    <th>Identificacion</th>
                    <th>Nombre Cliente</th>
                    <th>Viaja</th>
                    <th>Ultima Compra</th>
                    <th>Ultima Gestión</th>
                    <th>Ciudad</th>
                    <th>Gestiones</th>
                    <th>Info Cliente</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((tercero) => (
                        <tr key={tercero.StrIdTercero} className={`${(moment(Date.now()).diff(moment(tercero.ultima_gestion).format('L'), 'days')) < 60 && "bg-cyan-200/80"}`}>

                            <td className={`estado`}>{tercero.Estado}</td>
                            <td>{tercero.StrIdTercero}</td>
                            <td>{tercero.Nombre_tercero}</td>
                            <td className='text-center'>{tercero.Viaja}</td>
                            <td>{tercero.ultima_Compra !== null ? fechaParseada(tercero.ultima_Compra.toString()) : ""}</td>
                            <td>{tercero.ultima_gestion !== null ? fechaParseada(tercero.ultima_gestion) : ""}</td>
                            <td className='flex flex-col items-center justify-center'>
                                <span>{tercero.ciudad}</span>
                                {
                                    (tercero.ciudad == "MEDELLÍN" && tercero.barrio == "LA CANDELARIA") && (
                                        <span>HUECO</span>
                                    )
                                }
                                {
                                    (tercero.ciudad == "MEDELLÍN" && tercero.barrio !== "LA CANDELARIA") && (
                                        <span>PERIFERIA</span>
                                    )
                                }
                            </td>
                            <td className='text-center w-fit'><span className='flex items-center justify-center cursor-pointer w-fit' onClick={() => {
                                setviewGestionesCliente(true)
                                setidClienteGestiones({
                                    strNombre: tercero.Nombre_tercero,
                                    stridCedula: tercero.StrIdTercero
                                });
                            }}><MdOutlineManageAccounts size={22} className="optionP" /></span></td>
                            <td className='text-center w-fit'><span className='flex items-center justify-center cursor-pointer w-fit' onClick={() => {
                                setviewInfoCliente(true)
                                setidClienteGestiones({
                                    strNombre: tercero.Nombre_tercero,
                                    stridCedula: tercero.StrIdTercero
                                });
                            }}><AiOutlineUser size={22} className="optionP" /></span></td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
