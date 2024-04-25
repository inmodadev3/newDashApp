import 'react-tabs/style/react-tabs.css';
import axios from "../../Utils/BaseUrlAxio";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react"
import { MenuSelectedContext } from "../../context/UseContextProviders"
import { AppLayout } from "../../Components/AppLayout/AppLayout"
import { useAlert } from "../../hooks/useAlert";
import { AgregarAlerta, FormateoNumberInt } from "../../Utils/Helpers";
import { AiOutlineMore, AiOutlineFileExcel, AiOutlinePrinter, AiOutlineDelete } from 'react-icons/ai'
import { BuscadorPedidos } from "./BuscadorPedidos";
import { Excel_Pedidos } from '../../Utils/excelTemplates/ExcelFormats';
import { IDataProductosPdf } from '../pdfs/pedidos/PedidosPDF';
import { PermisosContext } from '../../context/permisosContext';
import { FaEdit, FaFileContract } from 'react-icons/fa';
import { IoPricetag } from 'react-icons/io5';
import { Seguimientos } from './Seguimientos/Seguimientos';
import { SubMenuSections } from '../../Components/MenuLateral/MenuSections';
import { Loader } from '../../Components/LoadingPage/Loader';

export type TPedidosProps = {
    intIdPedido: number,
    strIdPedidoVendedor: number,
    strNombVendedor: string,
    strNombCliente: string,
    dtFechaFinalizacion: string,
    dtFechaEnvio: string,
    intValorTotal: number,
    intEstado: number
    pago: number,
    isDropi: number
}

interface IProps {
    intIdPedDetalle: number,
    intIdPedido: number,
    strIdProducto: string,
    strDescripcion: string,
    intCantidad: number,
    strUnidadMedida: string,
    strObservacion: string,
    intPrecio: number,
    intPrecioProducto: number,
    strColor: string,
    strTalla: string,
    intEstado: number,
    ubicaciones: string
}

interface IpropsArrayExcel {
    StrSerie: number,
    StrProducto: string,
    StrColor: string
    intCantidadDoc: number,
    intValorUnitario: number,
    intValorTotal: number,
}

type TEstadosPedidos = {
    nombre: string,
    estilo: string
}

export type TSeguimiento = {
    NroPedido: string,
    Cliente: string,
    Pago: string | null,
    Ciudad: string | null,
    Vendedor: string | null,
    TipoVenta: string | null,
    Encargado_Alistamiento1: string | null,
    Encargado_Alistamiento2: string | null,
    Encargado_Alistamiento3: string | null,
    Encargado_Revision: string | null,
    Encargado_Facturacion: string | null,
    NroFactura: string | null,
    TipoEnvio: string | null | number,
    NroGuia: string | null,
    Despacho: string | null,
    ValorEnvio: number | null,
    NroCajas: string | null,
    Comentarios: string | null,
    Fecha_Facura: Date | null,
    Fecha_Pedido: Date | null,
    Fecha_Envio: Date | null,
    isDropi: boolean,
    Devolucion: boolean,
    Recaudo: string
    Estado: boolean
    Cartera: boolean
}

export interface IEncargados {
    alistamiento: TEncargados[]
    facturacion: TEncargados[]
    revision: TEncargados[]
}

export type TEncargados = {
    id: number,
    nombre: string,
    tipo_encargado_id: number,
    intEstado: number
}


export const Pedidos: React.FC = () => {
    const [pedidos, setpedidos] = useState<TPedidosProps[]>([] as TPedidosProps[])
    const [pedidosCopy, setpedidosCopy] = useState<TPedidosProps[]>([] as TPedidosProps[])
    const [isLoadingData, setisLoadingData] = useState(false)
    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const { permisos } = useContext(PermisosContext)
    const [revisionTrue, setrevisionTrue] = useState(false)
    const { createToast, alerts } = useAlert()
    const [isViewModalSeguimiento, setIsViewModalSeguimiento] = useState<boolean>(false)
    const [idPedidoSeguimiento, setidPedidoSeguimiento] = useState(0)
    const [Loadingpedidos, setLoadingpedidos] = useState(true)


    //FILTROS DE FECHAS
    const [mes, setmes] = useState(0)
    const [anio, setanio] = useState(0)
    const [aniosSelect, setaniosSelect] = useState<string>('')
    const [maxDate, setmaxDate] = useState('')



    const estados_pedidos: TEstadosPedidos[] = [
        {
            nombre: "Anulado",
            estilo: "p-1 bg-red-600  text-red-50"
        },
        {
            nombre: "Recibido",
            estilo: "p-2  bg-sky-300 text-sky-950"
        },
        {
            nombre: "Impreso 📰",
            estilo: "p-1 text-orange-800 bg-orange-300 "
        },
        {
            nombre: "En revision",
            estilo: "p-1 text-green-800 bg-green-300 "
        },
        {
            nombre: "Revisado  🌟",
            estilo: "p-1 text-green-800 bg-green-300 "
        }
    ]

    useEffect(() => {
        setMenuSelected(4)
        setSubmenuSelected(SubMenuSections.VER_PEDIDOS)
        CalcularAnios()

        window.document.title = "Panel - Pedidos"
    }, [])

    useEffect(() => {
        if (mes !== 0 && anio !== 0) {
            consultar_Pedidos()
        }
    }, [mes])

    useEffect(() => {
        if (permisos.length > 1) {
            let revision = permisos.find(permiso => permiso.id_permiso == 14)

            if (revision !== null && revision !== undefined) {
                setrevisionTrue(true)
            }
        }
    }, [permisos])

    const consultar_Pedidos = async () => {
        setLoadingpedidos(true)
        try {
            let { data } = await axios.get(`/pedidos?anio=${anio}&mes=${mes}`)
            if (data.success) {
                setpedidos(data.data)
                setpedidosCopy(data.data)
            }
        } catch (error) {
            console.error(error)
            AgregarAlerta(createToast, "Ha ocurrido un error", "danger")
        } finally {
            setLoadingpedidos(false)
        }
    }

    const anular_Pedido = async (id: number) => {
        let data = await axios.put('/pedidos/actualizar_estado', {
            id: id,
            estado: -1
        })

        if (data.data.success) {
            setpedidos((prevData) =>
                prevData.map((pedido) =>
                    pedido.intIdPedido === id ? { ...pedido, intEstado: -1 } : pedido
                )
            );
        }
    }

    const procesar_pedido = async (id: number, estado_actual: number, estado_nuevo: number) => {
        if (estado_nuevo == 2 && estado_actual !== 1) {
            return;
        }

        let data = await axios.put('/pedidos/actualizar_estado', {
            id: id,
            estado: estado_nuevo
        })

        if (data.data.success) {
            setpedidos((prevData) =>
                prevData.map((pedido) =>
                    pedido.intIdPedido === id ? { ...pedido, intEstado: estado_nuevo } : pedido
                )
            );
        }
    }

    const compararNombresAZ = (a: IDataProductosPdf, b: IDataProductosPdf) => {
        return a.strIdProducto.localeCompare(b.strIdProducto)
    }

    const Descargar_excel_pedido = async (pedidoId: number) => {

        try {
            const data = await axios.get(`/pedidos/detalle_pedido/${pedidoId}`)
            const data_Pedido: IpropsArrayExcel[] = []
            if (data.data.success) {
                let response = data.data.data
                response.sort(compararNombresAZ)
                if (response) {
                    response.forEach((item: IProps, index: number) => {
                        data_Pedido.push({
                            'StrSerie': index + 1,
                            'StrProducto': item.strIdProducto,
                            'StrColor': '0',
                            'intCantidadDoc': item.intCantidad,
                            'intValorUnitario': item.intPrecio,
                            'intValorTotal': item.intCantidad * item.intPrecio,
                        },)
                    });
                }
                Excel_Pedidos(data_Pedido, "TblDetalleDocumentos", `${data.data.header.intIdpedido}-${data.data.header.strNombCliente}`)
            } else {
                console.error(data)
            }
        } catch (error) {
            console.error(error)
            AgregarAlerta(createToast, "Ha ocurrido un error al descargar el pedido", "danger")
        }
    }

    const CambiarPrecioPedido = (IdPedido: number) => async () => {

        try {
            const response = await axios.put('/pedidos/precios_productos', {
                "idPedido": IdPedido,
                "intPrecio": 1
            })
            setpedidos((prevValue) =>
                prevValue.map((pedido) =>
                    pedido.intIdPedido == IdPedido ? { ...pedido, intValorTotal: response.data.total } : pedido
                )
            )
            const UrlPedido = `https://panel.inmodafantasy.com.co/#/pedidos/revisar/${IdPedido}`

            AgregarAlerta(createToast, "Pedido actualizado con exito", 'success')

            setTimeout(() => {
                window.open(`https://web.whatsapp.com/send?phone=573009933162&text=${encodeURIComponent(`Se acaba de registrar un nuevo pedido de edixon guerra \n ${UrlPedido}`)}`)
            }, 1000);

        } catch (error) {
            AgregarAlerta(createToast, "Error al actualizar el pedido", "danger")
            console.error(error)
        }
    }

    const openModalSeguimiento = (idPedido: TPedidosProps) => async () => {
        setIsViewModalSeguimiento(true)
        setidPedidoSeguimiento(idPedido.intIdPedido)
    }

    const seguimientoPedido = (pedido: TPedidosProps) => {
        let estado;
        if (pedido.pago == 0 || pedido.pago == null) {
            return;
        }

        if (pedido.isDropi) {
            estado = "Pagado 💲"
        } else {
            estado = "Despachado 🚚"
        }

        return estado

    }

    const CalcularAnios = () => {
        let fechaActual = new Date();

        // Obtén el año y el mes actual
        let year = fechaActual.getFullYear();
        let month = fechaActual.getMonth() + 1; // Se agrega 1 ya que los meses en JavaScript van de 0 a 11

        // Formatea el año y el mes con ceros a la izquierda si es necesario
        let formattedMonth = month < 10 ? '0' + month : month;
        setmes(month)
        setanio(year)
        setmaxDate(year + '-' + formattedMonth)
        setaniosSelect(year + '-' + formattedMonth)
    }

    const handleChangeDateSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fecha_string = e.target.value;
        setLoadingpedidos(true)
        if (fecha_string) {
            const [anio, mes] = fecha_string.split('-').map(Number);
            const fecha = new Date(anio, mes - 1, 1);
            fecha.setMonth(fecha.getMonth() + 1);
            fecha.setDate(0);

            const nuevoMes = fecha.getMonth() + 1;
            const nuevoAnio = fecha.getFullYear();
            const formattedMonth = nuevoMes < 10 ? '0' + nuevoMes : nuevoMes.toString();

            console.log(nuevoMes)
            console.log(nuevoAnio)

            setmes(nuevoMes);
            setanio(nuevoAnio);
            setaniosSelect(`${nuevoAnio}-${formattedMonth}`);
        } else {
            console.error("La fecha proporcionada es undefined o null.");
            setLoadingpedidos(false)
        }
    }

    const FiltradorDeSeguimientos = (option: number) => {
        const value = option


        switch (value) {
            case 1:
                console.log(pedidosCopy)
                setpedidos(pedidosCopy)
                break;
            case 2:
                const despachados = pedidosCopy.filter((item) => {
                    if (item.pago == 1 && item.isDropi == 0) {
                        return item
                    }
                })
                setpedidos(despachados)
                break;
            case 3:
                const sinDespachar = pedidosCopy.filter((item) => {
                    if ((item.pago == 0 || item.pago == null) && (item.isDropi == 0 || item.isDropi == null)) {
                        return item
                    }
                })
                setpedidos(sinDespachar)
                break;
            case 4:
                const impresos = pedidosCopy.filter((item) => {
                    if (item.intEstado == 2) {
                        return item
                    }
                })
                setpedidos(impresos)
                break;
            case 5:
                const enRevision = pedidosCopy.filter((item) => {
                    if (item.intEstado == 3) {
                        return item
                    }
                })
                setpedidos(enRevision)
                break;
            case 6:
                const revisados = pedidosCopy.filter((item) => {
                    if (item.intEstado == 4) {
                        return item
                    }
                })
                setpedidos(revisados)
                break;
            case 7:
                const anulados = pedidosCopy.filter((item) => {
                    if (item.intEstado == 0) {
                        return item
                    }
                })
                setpedidos(anulados)
                break;
            case 8:
                const recibidos = pedidosCopy.filter((item) => {
                    if (item.intEstado == 1) {
                        return item
                    }
                })
                setpedidos(recibidos)
                break;
            default:
                break;
        }
    }

    return (
        <AppLayout>
            {
                !Loadingpedidos ?
                    (
                        <section className="flex justify-center w-full h-screen">
                            <div className="w-full my-5 mt-10 bg-gray-100 rounded h-6/6">
                                <div className="flex flex-col my-2">
                                    <BuscadorPedidos ConsultarPedidosEnProceso={consultar_Pedidos} setdatos={setpedidos} setloadData={setisLoadingData} />
                                    <section className='mx-6'>
                                        <div className='flex justify-between gap-x-4'>
                                            <label className='flex flex-col'>
                                                Fecha
                                                <input
                                                    type='month'
                                                    max={maxDate}
                                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                                    value={aniosSelect}
                                                    onChange={handleChangeDateSelected}
                                                />
                                            </label>
                                            <label className='flex items-center justify-center gap-x-4'>
                                                <p>Filtrar:</p>
                                                <select
                                                    className='px-2 py-1 border-2 border-gray-400 rounded outline-none'
                                                    onChange={(e) => {
                                                        FiltradorDeSeguimientos(parseInt(e.target.value))
                                                    }}
                                                >
                                                    <option value={1}>Todos</option>
                                                    <option value={8}>Recibidos</option>
                                                    <option value={2}>Despachados</option>
                                                    <option value={3}>Sin despachar</option>
                                                    <option value={4}>Impresos</option>
                                                    <option value={5}>En revision</option>
                                                    <option value={6}>Revisados</option>
                                                    <option value={7}>Anulados</option>
                                                </select>
                                            </label>

                                        </div>
                                    </section>
                                </div>
                                {!isLoadingData ?
                                    (
                                        <div className="w-full px-4">
                                            <table className="w-full bg-gray-100 border-2 border-black/30">
                                                <thead>
                                                    <tr className="border-b-2 border-b-black/30 text-center [&>th]:py-4">
                                                        <th>Documento</th>
                                                        <th>Fecha</th>
                                                        <th>Cliente</th>
                                                        <th>Valor</th>
                                                        <th>Vendedor</th>
                                                        <th>Estado</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        pedidos?.map((pedido) => (
                                                            <tr
                                                                key={pedido.intIdPedido}
                                                                className="border-b-2 border-b-black/20 text-center py-12 [&>td]:py-8 [&>td]:text-sm"
                                                            >
                                                                <td>{pedido.intIdPedido}</td>
                                                                <td className="flex flex-col">
                                                                    <span>{moment.utc(pedido.dtFechaEnvio).local().format("MMM. DD, YYYY")}</span>
                                                                    <span>{moment.utc(pedido.dtFechaEnvio).local().format("hh:mm A")}</span>
                                                                </td>
                                                                <td className="w-60">{pedido.strNombCliente}</td>
                                                                <td>{FormateoNumberInt((pedido.intValorTotal).toString())}</td>
                                                                <td className="w-60">{pedido.strNombVendedor}</td>
                                                                <td>
                                                                    {
                                                                        pedido.intEstado == -1 ? (<span className="p-1 bg-red-600 rounded text-red-50">Anulado </span>)
                                                                            : (
                                                                                <article className='flex flex-col gap-y-2'>
                                                                                    <span className={`${estados_pedidos[pedido.intEstado] ? estados_pedidos[pedido.intEstado].estilo : estados_pedidos[2].estilo} rounded`}>{estados_pedidos[pedido.intEstado] ? estados_pedidos[pedido.intEstado].nombre : estados_pedidos[2].nombre}</span>
                                                                                    {(pedido.pago !== null && pedido.pago !== 0) && (
                                                                                        <span className='p-1 bg-green-600 text-red-50'>{seguimientoPedido(pedido)}</span>
                                                                                    )}
                                                                                </article>
                                                                            )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div className="relative flex items-center justify-center w-full h-full group">
                                                                        <span className="z-10 flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-gray-400/30">
                                                                            <AiOutlineMore size={26} />
                                                                        </span>
                                                                        <div className="absolute z-20 flex-col hidden p-2 transform -translate-x-1/2 bg-white border border-gray-300 rounded shadow-md top-full group-hover:flex w-60">
                                                                            {/* Contenido del cuadro de opciones */}
                                                                            {
                                                                                (!revisionTrue) && (
                                                                                    <>
                                                                                        <button onClick={() => { Descargar_excel_pedido(pedido.intIdPedido) }} className="flex items-center px-4 py-3 hover:bg-gray-200 gap-x-10">
                                                                                            <span><AiOutlineFileExcel size={20} /></span>
                                                                                            <span>Descargar Excel</span>
                                                                                        </button>
                                                                                        <button className="flex items-center px-4 py-3 hover:bg-gray-200 gap-x-10" onClick={() => { anular_Pedido(pedido.intIdPedido) }}>
                                                                                            <span><AiOutlineDelete size={20} /></span>
                                                                                            <span>Anular pedido</span>
                                                                                        </button>

                                                                                    </>
                                                                                )
                                                                            }

                                                                            <a
                                                                                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200 gap-x-10"
                                                                                target="_blank"
                                                                                href={`/#/pedidos/pdf/${pedido.intIdPedido}`}
                                                                                onClick={() => {
                                                                                    procesar_pedido(pedido.intIdPedido, pedido.intEstado, 2)
                                                                                }}
                                                                            >
                                                                                <span><AiOutlinePrinter size={20} /></span>
                                                                                <span>Imprimir pedido</span>
                                                                            </a>


                                                                            {
                                                                                (pedido.intEstado !== 4) && (
                                                                                    <a
                                                                                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200 gap-x-10"
                                                                                        target="_blank"
                                                                                        href={`/#/pedidos/revisar/${pedido.intIdPedido}`}
                                                                                        onClick={() => {
                                                                                            procesar_pedido(pedido.intIdPedido, pedido.intEstado, 3)
                                                                                        }}
                                                                                    >

                                                                                        <span><FaEdit size={20} /></span>
                                                                                        <span>Revisar Pedido</span>
                                                                                    </a>
                                                                                )
                                                                            }


                                                                            <button
                                                                                className='flex items-center px-4 py-3 hover:bg-gray-200 gap-x-10'
                                                                                onClick={openModalSeguimiento(pedido)}
                                                                            >
                                                                                <span><FaFileContract size={20} /></span>
                                                                                <span>Seguimiento de pedido</span>
                                                                            </button>

                                                                            {
                                                                                pedido.strNombCliente.toLowerCase().includes("edixon") && (
                                                                                    <button onClick={CambiarPrecioPedido(pedido.intIdPedido)} className='flex items-center px-4 py-3 hover:bg-gray-200 gap-x-10'>
                                                                                        <span><IoPricetag /></span>
                                                                                        <span>Pasar a precio 1</span>
                                                                                    </button>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>) :
                                    (
                                        <h1>Cargando datos...</h1>
                                    )}
                            </div>
                        </section>
                    )
                    : (
                        <div>
                            <Loader />
                        </div>
                    )

            }

            {
                isViewModalSeguimiento && (
                    <Seguimientos
                        setIsViewModalSeguimiento={setIsViewModalSeguimiento}
                        intIdPedido={idPedidoSeguimiento}
                        setpedidos={setpedidos}
                        setpedidosCopy={setpedidosCopy}
                    />
                )
            }
            {alerts}
        </AppLayout>
    )
}
