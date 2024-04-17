import React, { useContext, useEffect, useState } from 'react'
import axios from '../../../Utils/BaseUrlAxio'
import moment from 'moment'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { Seguimientos } from './Seguimientos'

export type PropsSeguimientos = {
    "id": number,
    "intIdPedido": number,
    "id_encargado": number | null,
    "Pago": string | null,
    "Ciudad": string | null,
    "Vendedor": string | null,
    "TipoVenta": string | null,
    "NroFactura": number | null,
    "TipoEnvio": string | null | number,
    "NroGuia": string | null,
    "Despacho": string | null,
    "ValorEnvio": string | null,
    "NroCajas": string | null,
    "Comentarios": string | null,
    "Fecha_Facura": string | null,
    "Fecha_Pedido": string | null,
    "Fecha_Envio": string | null,
    "isDropi": number | null,
    "Devolucion": number | null,
    "Recaudo": string | null,
    "estado": number | null,
    "cliente": string | null,
    "id_encargado2": number | null,
    "id_encargado3": number | null,
    "id_encargadoFacturacion": number | null,
    "id_encargadoRevision": number | null,
    "Cartera": number | null
}

export const SeguimientosPanel: React.FC = () => {

    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const [seguimientos, setseguimientos] = useState<PropsSeguimientos[]>([])
    const [seguimientosCopy, setseguimientosCopy] = useState<PropsSeguimientos[]>([])
    const [idEditar, setidEditar] = useState(0)
    const [IsViewModalSeguimiento, setIsViewModalSeguimiento] = useState(false)


    useEffect(() => {
        setMenuSelected(MenuSections.PEDIDOS)
        setSubmenuSelected(SubMenuSections.VER_SEGUIMIENTOS)
        consultarSeguimientos()
    }, [])

    const consultarSeguimientos = async () => {
        try {
            const response = await axios.get('/pedidos/seguimientos')
            setseguimientos(response.data.seguimientos)
            setseguimientosCopy(response.data.seguimientos)
        } catch (error) {
            console.error(error)
        }
    }

    const validarEstadoSeguimiento = (seguimiento: PropsSeguimientos) => {

        if (seguimiento.Devolucion == 1) {
            return {
                name: 'Devolucion 🔃',
                bg: 'bg-red-500'
            }
        }

        if (seguimiento.estado !== 0 && seguimiento.estado !== null) {
            if (seguimiento.isDropi !== 0 && seguimiento.isDropi !== null) {
                return {
                    name: 'Pagado 💲',
                    bg: 'bg-green-600'
                }
            } else {
                return {
                    name: 'Despachado 🚚',
                    bg: 'bg-green-500'
                }
            }
        }

        if (seguimiento.NroFactura !== null) {
            return {
                name: 'Facturado 📃',
                bg: 'bg-orange-500'
            }
        }

        return;
    }

    const openModalSeguimiento = (id: number) => async () => {
        setIsViewModalSeguimiento(true)
        setidEditar(id)
    }

    const BuscarPorId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const data = seguimientosCopy.filter((seguimiento) =>
            (seguimiento.intIdPedido.toString()).includes(value) ||
            (seguimiento.NroFactura !== null && seguimiento.NroFactura.toString().includes(value)) ||
            (seguimiento.cliente?.toLocaleLowerCase().includes(value.toLowerCase())) ||
            (seguimiento.NroGuia !== null && seguimiento.NroGuia.toLowerCase().includes(value.toLowerCase())) || 
            (seguimiento.Vendedor?.toLocaleLowerCase().includes(value.toLowerCase()))
        )
        setseguimientos(data)
    }


    return (
        <AppLayout>
            <div>
                <section className='flex justify-between my-2'>
                    <input
                        type='text'
                        className='w-1/2 p-2 border-2 rounded outline-none border-slate-300'
                        placeholder='Buscar por id'
                        onChange={BuscarPorId}
                    />
                    {/*  <label className='flex gap-x-4'>
                        <p>Ordenar por: </p>
                        <select>
                            <option>Id</option>
                            <option>Estado</option>
                            <option>Id</option>
                            <option>Id</option>
                        </select>
                    </label> */}

                </section>
                {
                    seguimientos.length > 0 ? (
                        <table className="w-full my-2 bg-gray-100 border-2 border-black/30">
                            <thead >
                                <tr className="border-b-2 border-b-black/30 text-center [&>th]:py-4">
                                    <th>Pedido</th>
                                    <th>Cliente</th>
                                    <th>Vendedor</th>
                                    <th>Venta</th>
                                    <th>Factura</th>
                                    <th>Estado</th>
                                    <th>Información</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    seguimientos.map((seguimiento) => (
                                        <tr
                                            key={seguimiento.intIdPedido}
                                            className='border-b-2 border-b-black/20 text-center py-12 [&>td]:py-8 [&>td]:text-sm'
                                        >
                                            <td className='flex flex-col'>
                                                <span>{seguimiento.intIdPedido}</span>
                                                <span>{moment(seguimiento.Fecha_Pedido).local().format('MMM. DD, YYYY')}</span>
                                            </td>
                                            <td className="w-60">{seguimiento.cliente}</td>
                                            <td className="w-60">{seguimiento.Vendedor}</td>
                                            <td>{seguimiento.TipoVenta}</td>
                                            <td className='flex flex-col'>
                                                <span>{seguimiento.NroFactura}</span>
                                                {seguimiento.Fecha_Facura && (
                                                    <span>{moment(seguimiento.Fecha_Facura).local().format('MMM. DD, YYYY')}</span>
                                                )}
                                            </td>
                                            <td>
                                                <article className='flex'>
                                                    <span className={`${validarEstadoSeguimiento(seguimiento)?.bg} px-2 py-1 rounded text-white w-full`}>{validarEstadoSeguimiento(seguimiento)?.name}</span>
                                                </article>
                                            </td>
                                            <td>
                                                <span className='flex items-center justify-center'><span className='cursor-pointer ' onClick={openModalSeguimiento(seguimiento.intIdPedido)}><CgArrowsExchangeAlt size={32} /></span></span>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    ) : (
                        <div>
                            <h3 className='text-xl font-bold'>No se han encontrado seguimientos</h3>
                        </div>
                    )
                }

                {
                    IsViewModalSeguimiento && (
                        <Seguimientos
                            setIsViewModalSeguimiento={setIsViewModalSeguimiento}
                            intIdPedido={idEditar}
                            setpedidos={setseguimientos}
                            setpedidosCopy={setseguimientosCopy}
                        />
                    )
                }

            </div>
        </AppLayout>
    )
}
