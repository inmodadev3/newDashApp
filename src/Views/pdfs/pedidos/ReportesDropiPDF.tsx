import React, { useContext, useEffect, useState } from 'react'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import axios from '../../../Utils/BaseUrlAxio'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { PDFViewer } from '@react-pdf/renderer'
import { TemplateReportes } from '../../../templates/pedidos/TemplateReportes'

export type PropsReportes = {
    intIdPedido: number,
    strIdPedidoVendedor: number,
    strNombVendedor: string,
    strNombCliente: string,
    dtFechaFinalizacion: string,
    dtFechaEnvio: string,
    intValorTotal: number,
    intEstado: number,
    pago: number,
    isDropi: number
}

export const ReportesDropiPDF:React.FC = () => {

    const { setMenuSelected } = useContext(MenuSelectedContext)
    const [reportes, setreportes] = useState<PropsReportes[]>([])
    const [isLoadingData, setisLoadingData] = useState(false)

    useEffect(() => {
        setMenuSelected(4)
        obtenerReporte()
    }, [])

    const obtenerReporte = async () => {
        setisLoadingData(true)
        try {
            const response = await axios.get('/pedidos/reportes/dropi')
            console.log(response)
            setreportes(response.data.reporte)
        } catch (error) {
            alert("Ha ocurrido un error")
            console.error(error)
        } finally {
            setisLoadingData(false)
        }
    }

    return (
        <AppLayout>
            <section>
                <div className='w-full h-screen py-2'>
                    {
                        (!isLoadingData && reportes) &&
                        (
                            <PDFViewer style={{ flex: 1, width: '99%', height: '99%' }}>
                                <TemplateReportes datos={reportes} />
                            </PDFViewer>
                        )
                    }
                </div>
            </section>
        </AppLayout>
    )
}
