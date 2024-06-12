import React, { useContext, useEffect, useState } from 'react'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import axios from '../../../Utils/BaseUrlAxio'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { PDFViewer } from '@react-pdf/renderer'
import { PropsReportes } from './ReportesDropiPDF'
import { TemplateReportesCartera } from '../../../templates/pedidos/TemplateReportesCartera'


export const ReportesDropiCartera: React.FC = () => {
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
            const response = await axios.get(`/pedidos/reportes/dropi/cartera`)
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
                                <TemplateReportesCartera datos={reportes} />
                            </PDFViewer>
                        )
                    }
                </div>
            </section>
        </AppLayout>
    )
}
