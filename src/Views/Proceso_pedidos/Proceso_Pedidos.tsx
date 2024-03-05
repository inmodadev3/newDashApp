import React, { useContext, useEffect, useState } from 'react'
import { MenuSelectedContext } from '../../context/UseContextProviders'
import { MenuSections } from '../../Components/MenuLateral/MenuSections'
import { AppLayout } from '../../Components/AppLayout/AppLayout'
import { IPropsVendedor, Modal_GenerarLinksTienda } from '../../Components/Modals/Modal_GenerarLinksTienda'
import axios from '../../Utils/BaseUrlAxio'
import moment from 'moment'
import { FormateoNumberInt } from '../../Utils/Helpers'
import { AiOutlineEye, AiTwotoneDelete } from 'react-icons/ai'
import { Modal_Productos_Pedidos_Proceso } from '../../Components/Modals/Modal_Productos_Pedidos_Proceso'


interface IPropsPedidos {
    "intIdPedido": number,
    "strIdVendedor": string,
    "strNombVendedor": string,
    "strIdCliente": string,
    "strNombCliente": string,
    "strCiudadCliente": string,
    "intValorTotal": number,
    "dtFechaFinalizacion": Date,
    "dtFechaEnvio": Date,
    "dtFechaModificacion": Date,
    "dtFechaInicio": string,
    "dtFechaFinal": Date,
    "strObservacion": string,
    "strCorreoClienteAct": string,
    "strTelefonoClienteAct": string,
    "strCelularClienteAct": string,
    "strCiudadClienteAct": string,
    "strIdDependencia": string,
    "strNombreDependencia": string,
    "intEstado": number
}

export const Proceso_Pedidos: React.FC = () => {
    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const [isViewGenerarLinks, setisViewGenerarLinks] = useState(false)
    const [isViewDetallesPedido, setisViewDetallesPedido] = useState(false)
    const vendedor = localStorage.getItem('dataUser')
    const [pedidos, setpedidos] = useState<IPropsPedidos[]>([])
    const [idPedidoDetalle, setidPedidoDetalle] = useState(0)
    const estado_pedido = ['En proceso', 'Finalizado', 'Eliminado']
    const colores_estado = ['bg-green-500', 'bg-blue-500', 'bg-red-500']

    useEffect(() => {
        setMenuSelected(MenuSections.PROCESO_PEDIDOS)
        setSubmenuSelected(0)
        GetPedidos()
        window.document.title = "Panel - Proceso de pedidos"
    }, [])

    const handleChangeVisibleModalLinks = () => {
        setisViewGenerarLinks(true)
    }

    const GetPedidos = async () => {
        try {
            if (vendedor) {
                const JsonVendedor: IPropsVendedor = JSON.parse(vendedor)
                const data = await axios.get(`/proceso_pedidos/${JsonVendedor.strIdVendedor}`)
                setpedidos(data.data.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleChangePedidoId = (id: number) => {
        setidPedidoDetalle(id)
        setisViewDetallesPedido(true)
    }

    const EliminarPedidoActivo = async (idPedido: number) => {
        await axios.put(`/proceso_pedidos/estado`, {
            estado: 3,
            idPedido: idPedido
        })

        setpedidos((prevData) =>
            prevData.map((pedido) =>
                pedido.intIdPedido === idPedido ? { ...pedido, intEstado: 3 } : pedido
            )
        );
    }

    return (
        <AppLayout>
            <section className='w-full my-4 '>
                <button onClick={handleChangeVisibleModalLinks} className='px-6 py-1 bg-blue-600 rounded text-slate-100'>Generar link</button>
            </section>
            <h1 className='text-2xl font-medium text-center text-slate-600'>Proceso de pedidos</h1>
            <div className='px-8 py-2 h-full max-h-[600px] bg-gray-100 overflow-y-scroll'>
                {
                    pedidos.length > 0 ? (
                        <table className='w-full border '>
                            <thead>
                                <tr className='border-2 border-gray-400 [&>th]:py-4'>
                                    <th className='px-3'>Id</th>
                                    <th>Cliente</th>
                                    <th>Identificacion</th>
                                    <th>Fecha Creacion</th>
                                    <th>Valor Total	</th>
                                    <th>Estado</th>
                                    <th>Visualizar Pedido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pedidos.map((pedido) => (
                                        <tr key={pedido.intIdPedido} className='[&>td]:text-center [&>td]:py-6 text-sm border-2 border-gray-400 hover:bg-slate-300'>
                                            <td>{pedido.intIdPedido}</td>
                                            <td>{pedido.strNombCliente}</td>
                                            <td>{pedido.strIdCliente}</td>
                                            <td>{moment.utc(pedido.dtFechaInicio).format('DD-MM-YYYY / HH-mm A')}</td>
                                            <td>${FormateoNumberInt((pedido.intValorTotal).toString())}</td>
                                            <td className={` text-white ${colores_estado[pedido.intEstado - 1]}`}>{estado_pedido[pedido.intEstado - 1]}</td>
                                            <td className='flex items-center justify-center gap-4'>
                                                <span onClick={() => { handleChangePedidoId(pedido.intIdPedido) }} className='cursor-pointer'><AiOutlineEye size={20} /></span>
                                                {
                                                    pedido.intEstado == 1 && (
                                                        <span onClick={() => { EliminarPedidoActivo(pedido.intIdPedido) }} className='cursor-pointer'><AiTwotoneDelete size={20} color={"#E76B82"} /></span>
                                                    )
                                                }

                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>

                    ) : (
                        <article>
                            <p>Sin pedidos</p>
                        </article>
                    )
                }
            </div>

            {
                isViewDetallesPedido && (<Modal_Productos_Pedidos_Proceso CloseEvent={setisViewDetallesPedido} id={idPedidoDetalle} />)
            }

            {
                (isViewGenerarLinks && vendedor) && (<Modal_GenerarLinksTienda CloseEvent={setisViewGenerarLinks} vendedor={JSON.parse(vendedor)} />)
            }
        </AppLayout>
    )
}
