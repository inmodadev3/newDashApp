import { PDFViewer } from '@react-pdf/renderer'
import React, { useState, useEffect,useContext } from 'react'
import { TemplatePedidos } from '../../../templates/pedidos/TemplatePedidos'
import './stylesPDF.css'
import { useParams } from 'react-router-dom'
import axios from '../../../Utils/BaseUrlAxio'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../Utils/UseContextProviders'

interface IHeaderPdf {
    dtFechaEnvio: string
    intIdpedido: number
    strCiudadCliente: string
    strIdCliente: string
    strNombCliente: string
    strNombVendedor: string
    strTelefonoClienteAct: string
    strCorreoClienteAct: string
    strObservacion: string
    intValorTotal: number
}

interface IDataProductosPdf {
    intCantidad: number
    intEstado: number
    intIdPedDetalle: number
    intIdPedido: number
    intPrecio: number
    intPrecioProducto: number
    strColor: string
    strDescripcion: string
    strIdProducto: string
    strObservacion: string
    strTalla: string
    strUnidadMedida: string
    ubicaciones: string
}

export interface IDataPDF {
    data: IDataProductosPdf[]
    header: IHeaderPdf
}

export const PedidosPDF: React.FC = () => {

    const { pedidoId } = useParams()
    const [dataPedido, setdataPedido] = useState<IDataPDF>()
    const [loadingData, setloadingData] = useState(true)
    const { setMenuSelected} = useContext(MenuSelectedContext)

    useEffect(() => {
        GetInfoPedido()
        setMenuSelected(4)
    }, [])

    const GetInfoPedido = () => {
        axios.get(`/pedidos/detalle_pedido/${pedidoId}`)
            .then((response) => {
                if (response.data.success) {
                    setdataPedido(response.data)
                    setloadingData(false)
                } else {
                    console.error(response)
                }
            }).catch((err) => {
                alert("HA OCURRIDO UN ERROR AL CARGAR EL PDF")
                console.error(err)
            })
    }


    return (

        <AppLayout>
            <section>
                <div className='w-full h-screen py-2'>
                    {
                        !loadingData && dataPedido &&
                        (
                            <PDFViewer style={{ flex: 1, width: '99%', height: '99%' }}>
                                <TemplatePedidos datos={dataPedido} />
                            </PDFViewer>
                        )
                    }
                </div>
            </section>

        </AppLayout>
    )
}
