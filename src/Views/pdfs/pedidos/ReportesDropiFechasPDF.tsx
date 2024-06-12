import React, { useContext, useEffect, useState } from 'react'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import axios from '../../../Utils/BaseUrlAxio'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { PDFViewer } from '@react-pdf/renderer'
import { useLocation } from 'react-router-dom'
import { TemplateReportesFechas } from '../../../templates/pedidos/TemplateReportesFechas'

export type PropsReportes = {
    intIdPedido: number,
    strIdPedidoVendedor: number,
    strNombVendedor: string,
    strNombCliente: string,
    dtFechaFinalizacion: '',
    dtFechaEnvio: string,
    intValorTotal: number,
    intEstado: number,
    pago: number,
    isDropi: number,
    devolucion: number
}


export const ReportesDropiFechasPDF: React.FC = () => {
    const { setMenuSelected } = useContext(MenuSelectedContext)
    const [reportes, setreportes] = useState<PropsReportes[]>([])
    const [isLoadingData, setisLoadingData] = useState(false)
    const queryParams = useLocation().search

    useEffect(() => {
        setMenuSelected(4)
        obtenerReporte()
    }, [])

    const obtenerReporte = async () => {
        setisLoadingData(true)
        try {
            const response = await axios.get(`/pedidos/reportes/dropi${queryParams}`)
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
                                <TemplateReportesFechas datos={reportes} />
                            </PDFViewer>
                        )
                    }
                </div>
            </section>
        </AppLayout>
    )
}
