import React, { useContext, useEffect, useState } from 'react'
import axios from '../../../Utils/BaseUrlAxio'
import moment from 'moment'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { Seguimientos } from './Seguimientos'
import { Loader } from '../../../Components/LoadingPage/Loader'
import { AgregarAlerta } from '../../../Utils/Helpers'
import { useAlert } from '../../../hooks/useAlert'

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
    "pagoHGI": boolean,
    "PagoHGI": boolean | number
}

export const SeguimientosPanel: React.FC = () => {

    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const [seguimientos, setseguimientos] = useState<PropsSeguimientos[]>([])
    const [seguimientosCopy, setseguimientosCopy] = useState<PropsSeguimientos[]>([])
    const [idEditar, setidEditar] = useState(0)
    const [IsViewModalSeguimiento, setIsViewModalSeguimiento] = useState(false)
    const [loadingSeguimientos, setloadingSeguimientos] = useState(false)
    const { createToast, alerts } = useAlert()
    const [valorFiltro, setvalorFiltro] = useState(1)

    useEffect(() => {
        setMenuSelected(MenuSections.PEDIDOS)
        setSubmenuSelected(SubMenuSections.VER_SEGUIMIENTOS)
        consultarSeguimientos()
    }, [])

    const consultarSeguimientos = async () => {
        setloadingSeguimientos(true)
        try {
            const response = await axios.get('/pedidos/seguimientos')
            setseguimientos(response.data.seguimientos)
            setseguimientosCopy(response.data.seguimientos)
        } catch (error) {
            console.error(error)
        } finally {
            setloadingSeguimientos(false)
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
                    name: 'Pagado Dropi 💲',
                    bg: 'bg-green-500'
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

        if (value.toString().trim() !== "") {
            const data = seguimientosCopy.filter((seguimiento) =>
                (seguimiento.intIdPedido.toString()).includes(value) ||
                (seguimiento.NroFactura !== null && seguimiento.NroFactura.toString().includes(value)) ||
                (seguimiento.cliente?.toLocaleLowerCase().includes(value.toLowerCase())) ||
                (seguimiento.NroGuia !== null && seguimiento.NroGuia.toLowerCase().includes(value.toLowerCase())) ||
                (seguimiento.Vendedor?.toLocaleLowerCase().includes(value.toLowerCase()))
            )
            setseguimientos(data)
        } else {
            FiltradorDeSeguimientos(valorFiltro)
        }

    }

    const handleChangeFiltro = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value)
        setvalorFiltro(value)
    }

    const FiltradorDeSeguimientos = (option: number) => {
        const value = option

        switch (value) {
            case 1:
                setseguimientos(seguimientosCopy)
                break;
            case 2:
                const despachados = seguimientosCopy.filter((item) => {
                    if (item.estado == 1 && item.isDropi == 0) {
                        return item
                    }
                })

                setseguimientos(despachados)
                break;
            case 3:
                const noDepaschado = seguimientosCopy.filter((item) => {
                    if ((item.estado == null || item.estado == 0) && item.isDropi == 0) {
                        return item
                    }
                })

                setseguimientos(noDepaschado)
                break;
            case 4:
                const dropiPagados = seguimientosCopy.filter((item) => {
                    if (item.isDropi == 1 && item.estado == 1) {
                        return item
                    }
                })

                setseguimientos(dropiPagados)
                break;

            case 5:
                const dropiSinPagar = seguimientosCopy.filter((item) => {
                    if (item.isDropi == 1 && item.estado == 0) {
                        return item
                    }
                })

                setseguimientos(dropiSinPagar)
                break;
            case 6:
                const devoluciones = seguimientosCopy.filter((item) => {
                    if (item.Devolucion == 1) {
                        return item
                    }
                })

                setseguimientos(devoluciones)
                break;
            default:
                AgregarAlerta(createToast, 'Elija una opcion valida', 'warning')
                break;
        }
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
                    <label className='flex items-center justify-center gap-x-4'>
                        <p>Filtrar:</p>
                        <select
                            className='px-2 py-1 border-2 border-gray-400 rounded outline-none'
                            onChange={(e) => {
                                handleChangeFiltro(e)
                                FiltradorDeSeguimientos(parseInt(e.target.value))
                            }}
                        >
                            <option value={1}>Todos</option>
                            <option value={2}>Despachados</option>
                            <option value={3}>Sin despachar</option>
                            <option value={4}>Dropi Pagados</option>
                            <option value={5}>Dropi Sin pagar</option>
                            <option value={6}>Devoluciones</option>
                        </select>
                    </label>

                </section>
                {
                    !loadingSeguimientos ? (
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
                                                <article className='flex flex-col gap-y-3'>
                                                    <span className={`${validarEstadoSeguimiento(seguimiento)?.bg} px-2 py-1 rounded text-white w-full`}>{validarEstadoSeguimiento(seguimiento)?.name}</span>

                                                    {
                                                        ((seguimiento.pagoHGI !== undefined) || (seguimiento.PagoHGI == 1)) && (
                                                            <span className='w-full px-2 py-1 text-white rounded bg-cyan-500'>Pagado Hgi</span>
                                                        )
                                                    }
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
                            <Loader />
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

            {alerts}
        </AppLayout>
    )
}
