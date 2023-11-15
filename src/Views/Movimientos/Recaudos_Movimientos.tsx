import React, { useEffect, useState } from 'react'
import { LoaderInfo } from '../../Components/LoaderInfo/LoaderInfo'
import { AgregarAlerta, FormateoNumberInt } from '../../Utils/Helpers'
import { useAlert } from '../../hooks/useAlert'
import axios from '../../Utils/BaseUrlAxio'
import moment from 'moment'

type PropsRecaudosMovimientos = {
    setLoadingMovimiento: React.Dispatch<React.SetStateAction<boolean>>
    LoadingMovimiento: boolean
    mes: number
    año: number
    strIdVendedor: string
    setTotal: React.Dispatch<React.SetStateAction<number>>
}

type Recaudos = {
    "Doc_Venta": number,
    "Fecha_Doc": Date,
    "Fecha_Recaudo": Date,
    "valor": number,
    "descuento": number,
    "tercero": String
}


export const Recaudos_Movimientos: React.FC<PropsRecaudosMovimientos> = ({ setLoadingMovimiento, LoadingMovimiento, mes, año, strIdVendedor, setTotal }) => {

    const { alerts, createToast } = useAlert()
    const [recaudos, setrecaudos] = useState<Recaudos[]>([] as Recaudos[])

    useEffect(() => {
        if (mes !== 0 && año !== 0) {
            consultar_Recaudos()
        }
    }, [mes, año])

    useEffect(() => {
        if (recaudos.length > 0) {
            Calcular_Total()
        }
    }, [recaudos])



    const consultar_Recaudos = async () => {
        try {
            const response = await axios.get(`/movimientos/recaudos?mes=${mes}&año=${año}&strIdVendedor=${strIdVendedor}`)
            setrecaudos(response.data.data)
        } catch (error) {
            AgregarAlerta(createToast, `${error}`, 'danger')
        } finally {
            setLoadingMovimiento(false)
        }
    }

    const Calcular_Total = () => {
        try {
            let total = 0;
            recaudos.forEach((element) => {
                total += parseInt(element.valor.toFixed(0))
            })

            setTotal(total)
        } catch (error) {
            AgregarAlerta(createToast, `${error}`, 'danger')
        }
    }


    return (
        <div className='min-w-full'>
            {
                LoadingMovimiento ? (
                    <div className='flex items-center w-full mt-32 flex-col space-y-2'>
                        <LoaderInfo />
                        <span className='text-md font-medium text-gray-600'>Cargando Recaudos...</span>
                    </div>
                ) : (
                    <section className='h-[430px] overflow-y-scroll'>
                        <table className=' w-full border-b border-b-gray-800 '>
                            <thead className='border-b border-gray-400'>
                                <tr className='[&>th]:font-semibold [&>th]:text-start [&>th]:py-2'>

                                    <th>Nro Doc_Venta</th>
                                    <th>Fecha venta</th>
                                    <th>Fecha Recaudo</th>
                                    <th>Valor</th>
                                    <th>Descuento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    recaudos.map((recaudo, index) => (
                                        <tr key={index} className='[&>td]:py-4 border-b border-b-gray-300 [&>td]:font-medium [&>td]:text-sm hover:bg-gray-300'>
                                            <td>{recaudo.Doc_Venta}</td>
                                            <td>{moment(recaudo.Fecha_Doc).format('ll')}</td>
                                            <td>{moment(recaudo.Fecha_Recaudo).format('ll')}</td>
                                            <td>{FormateoNumberInt(recaudo.valor.toFixed(0))}</td>
                                            <td>{FormateoNumberInt(recaudo.descuento.toFixed(0))}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </section>
                )
            }
            {alerts}
        </div>
    )
}
