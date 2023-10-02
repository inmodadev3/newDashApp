import 'react-tabs/style/react-tabs.css';
import axios from "../../Utils/BaseUrlAxio";
import moment from "moment";
import { useContext, useEffect, useState } from "react"
import { MenuSelectedContext } from "../../Utils/UseContextProviders"
import { AppLayout } from "../../Components/AppLayout/AppLayout"
import { useAlert } from "../../hooks/useAlert";
import { AgregarAlerta, FormateoNumberInt } from "../../Utils/Helpers";
import { AiOutlineMore, AiOutlineFileExcel, AiOutlinePrinter, AiOutlineDelete } from 'react-icons/ai'
import { BuscadorPedidos } from "./BuscadorPedidos";
import { Excel_Pedidos } from '../../Utils/excelTemplates/ExcelFormats';
import { IDataProductosPdf } from '../pdfs/pedidos/PedidosPDF';
/* import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'; */
/* import { PedidosNuevos } from "./PedidosNuevos";
import { PedidosProceso } from "./PedidosProceso";
import { PedidosTerminal } from "./PedidosTerminal"; */

type TPedidosProps = {
    intIdPedido: number,
    strIdPedidoVendedor: number,
    strNombVendedor: string,
    strNombCliente: string,
    dtFechaFinalizacion: string,
    dtFechaEnvio: string,
    intValorTotal: number,
    intEstado: number
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

export const Pedidos = () => {
    const [pedidos, setpedidos] = useState<TPedidosProps[]>([] as TPedidosProps[])
    const [isLoadingData, setisLoadingData] = useState(false)
    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const { createToast, alerts } = useAlert()

    useEffect(() => {
        setMenuSelected(4)
        setSubmenuSelected(0)
        consultar_Pedidos()
        window.document.title = "Panel - Pedidos"
    }, [])

    const consultar_Pedidos = async () => {
        try {
            let { data } = await axios.get(`/pedidos`)
            if (data.success) {
                setpedidos(data.data)
            }
        } catch (error) {
            console.error(error)
            AgregarAlerta(createToast, "Ha ocurrido un error", "danger")
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

    const procesar_pedido = async (id: number, estado_actual: number) => {
        if (estado_actual !== 1) {
            return;
        }

        let data = await axios.put('/pedidos/actualizar_estado', {
            id: id,
            estado: 2
        })

        if (data.data.success) {
            setpedidos((prevData) =>
                prevData.map((pedido) =>
                    pedido.intIdPedido === id ? { ...pedido, intEstado: 2 } : pedido
                )
            );
        }

    }

    const compararNombresAZ = (a:IDataProductosPdf,b:IDataProductosPdf) =>{
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
                    response.forEach(( item:IProps, index:number ) => {
                        data_Pedido.push({
                            'StrSerie': index+1,
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
                console.log(data)
            }
        } catch (error) {
            console.error(error)
            AgregarAlerta(createToast, "Ha ocurrido un error al descargar el pedido", "danger")
        }
        /* const data1 = [
            {
                'StrSerie': '1',
                'StrProducto': 'AA0313',
                'StrColor': '0',
                'intCantidadDoc': '1',
                'intValorUnitario': '8300',
                'intValorTotal': '8300',
            },
            {
                'StrSerie': '2',
                'StrProducto': 'AA0329',
                'StrColor': '0',
                'intCantidadDoc': '1',
                'intValorUnitario': '3300',
                'intValorTotal': '3300',
            }
        ];
        
        Excel_Pedidos(data1, "prueba 2", "prueba_2") */
    }


    return (
        <AppLayout>
            {
                <section className="w-full h-screen flex justify-center">
                    <div className=" w-full h-6/6 my-5 rounded bg-gray-100 mt-10 overflow-scroll">
                        <div className="my-2">
                            <BuscadorPedidos ConsultarPedidosEnProceso={consultar_Pedidos} setdatos={setpedidos} setloadData={setisLoadingData} />
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
                                                            <span>{moment(pedido.dtFechaEnvio).format("MMM. DD, YYYY")}</span>
                                                            <span>{moment(pedido.dtFechaEnvio).format("h:mm A")}</span>
                                                        </td>
                                                        <td className="w-60">{pedido.strNombCliente}</td>
                                                        <td>{FormateoNumberInt((pedido.intValorTotal).toString())}</td>
                                                        <td className="w-60">{pedido.strNombVendedor}</td>
                                                        <td>
                                                            {
                                                                pedido.intEstado == 1 ? (<span className="bg-sky-300 p-2 rounded text-sky-950">Recibido</span>)
                                                                    : pedido.intEstado == -1 ? (<span className="bg-red-600 p-1 rounded text-red-50">Anulado </span>)
                                                                        : (<span className="bg-orange-300 p-1 rounded text-orange-800">Procesado </span>)
                                                            }
                                                        </td>
                                                        <td>
                                                            <div className="flex w-full h-full justify-center items-center relative group">
                                                                <span className="cursor-pointer w-10 h-10 bg-gray-400/30 rounded-full flex justify-center items-center z-10">
                                                                    <AiOutlineMore size={26} />
                                                                </span>
                                                                <div className="hidden absolute top-full transform -translate-x-1/2 bg-white border border-gray-300 p-2 rounded shadow-md group-hover:flex flex-col z-20 w-60">
                                                                    {/* Contenido del cuadro de opciones */}
                                                                    <button onClick={() => { Descargar_excel_pedido(pedido.intIdPedido) }} className="hover:bg-gray-200 py-3 px-4 flex items-center gap-x-10">
                                                                        <span><AiOutlineFileExcel size={20} /></span>
                                                                        <span>Descargar Excel</span>
                                                                    </button>
                                                                    <button className="hover:bg-gray-200 py-3 px-4 flex items-center gap-x-10" onClick={() => { anular_Pedido(pedido.intIdPedido) }}>
                                                                        <span><AiOutlineDelete size={20} /></span>
                                                                        <span>Anular pedido</span>
                                                                    </button>
                                                                    <a
                                                                        className="hover:bg-gray-200 py-3 px-4 flex items-center gap-x-10 cursor-pointer"
                                                                        target="_blank"
                                                                        href={`/#/pedidos/pdf/${pedido.intIdPedido}`}
                                                                        onClick={() => {
                                                                            procesar_pedido(pedido.intIdPedido, pedido.intEstado)
                                                                        }}
                                                                    >
                                                                        <span><AiOutlinePrinter size={20} /></span>
                                                                        <span>Imprimir pedido</span>
                                                                    </a>
                                                                    {/* <button className="hover:bg-gray-200 py-3 px-4 flex items-center gap-x-10">
                                                                        <span><AiOutlineSend size={20} /></span>
                                                                        <span>Enviar a HGI</span>
                                                                    </button> */}

                                                                    {/* ... Más opciones ... */}
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

            }

            {/* <Tabs>
                <TabList>
                    <Tab>Nuevos Pedidos</Tab>
                    <Tab>Pedidos En proceso</Tab>
                    <Tab>Pedidos En Terminal</Tab>
                </TabList>

                <TabPanel>
                    <PedidosNuevos/>
                </TabPanel>
                <TabPanel>
                    <PedidosProceso/>
                </TabPanel>
                <TabPanel>
                    <PedidosTerminal/>
                </TabPanel>
            </Tabs> */}
            {alerts}
        </AppLayout>
    )
}
