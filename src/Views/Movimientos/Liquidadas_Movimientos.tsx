import React, { useState, useEffect } from 'react'
import { useAlert } from '../../hooks/useAlert'
import { AgregarAlerta, FormateoNumberInt } from '../../Utils/Helpers'
import axios from '../../Utils/BaseUrlAxio'
import { LoaderInfo } from '../../Components/LoaderInfo/LoaderInfo'

type PropsLiquidadas = {
    setLoadingMovimiento: React.Dispatch<React.SetStateAction<boolean>>
    LoadingMovimiento: boolean
    mes: number
    año: number
    strIdVendedor: string
    setTotal: React.Dispatch<React.SetStateAction<number>>
    settotal_Pagar: React.Dispatch<React.SetStateAction<number>>
}

type Liquidadas = {
    "intIdMovimiento": number,
    "strDocumento": String,
    "intIdLiquidacion": number,
    "intBaseMonto": String,
    "strConcepto": String,
    "intAnno": number,
    "dtFechaDocumento": Date,
    "strTransaccion": String,
    "strNombreTransaccion": String,
    "intRecibo": number,
    "strTercero": String,
    "intId": number,
    "strNombre": String,
    "intMeta": number,
    "intTiempoVisita": number,
    "strDiasVisita": String,
    "intDescuento": number,
    "intValorMeta": number,
    "intIva": number,
    "intValor": number
}

export const Liquidadas_Movimientos: React.FC<PropsLiquidadas> = ({ setLoadingMovimiento, LoadingMovimiento, mes, año, strIdVendedor, setTotal, settotal_Pagar }) => {

    const { alerts, createToast } = useAlert()
    const [liquidadas, setliquidadas] = useState<Liquidadas[]>([])
    const [ingresos, setingresos] = useState<String[]>([])

    useEffect(() => {
        if (mes !== 0 && año !== 0) {
            setliquidadas([])
            setingresos([])
            consultar_Liquidadas()
        }
    }, [mes, año])

    useEffect(() => {
        calcular_Total()
    }, [liquidadas])


    const consultar_Liquidadas = async () => {
        setLoadingMovimiento(true)
        try {
            const response = await axios.get(`/movimientos/liquidadas?mes=${mes}&año=${año}&strIdVendedor=${strIdVendedor}`)
            if (response.data.data.length > 0) {
                Filtrar_liquidacion_nombres(response.data.data)
            } else {
                console.error('sin datos')
            }
        } catch (error) {
            AgregarAlerta(createToast, `${error}`, 'danger')
        } finally {
            setLoadingMovimiento(false)
        }
    }

    const Filtrar_liquidacion_nombres = (array: Liquidadas[]) => {
        let nombres: String[] = []

        array.map((item) => {
            nombres.push(item.strNombre)
        })

        let eliminar_duplicados: String[] = [...new Set(nombres)]

        setingresos(eliminar_duplicados)
        setliquidadas(array)
    }

    const calcular_valorXliquidacion = (ingreso: String, valor: number) => {
        let total = 0;

        liquidadas.map((liquidada) => {
            if (liquidada.strNombre == ingreso) {
                if (valor == 0) {
                    total += parseInt(liquidada.intBaseMonto.toString())
                } else {
                    total += parseInt((((liquidada.intValor / 100) * parseInt(liquidada.intBaseMonto.toString())).toFixed(0)))
                }
            }
        })

        return total
    }

    const calcular_Total = () => {
        let total = 0;
        let total_Pagar = 0

        liquidadas.forEach((liquidada) => {
            total += parseInt(liquidada.intBaseMonto.toString())
            total_Pagar += parseInt((((liquidada.intValor / 100) * parseInt(liquidada.intBaseMonto.toString())).toFixed(0)))
        })

        setTotal(total)
        settotal_Pagar(total_Pagar)
    }

    return (
        <div>
            {
                LoadingMovimiento ? (
                    <div className='flex flex-col items-center w-full mt-32 space-y-2'>
                        <LoaderInfo />
                        <span className='font-medium text-gray-600 text-md'>Cargando Facturas liquidadas...</span>
                    </div>
                ) : (
                    ingresos.map((ingreso, index) => (
                        <div key={index} className='mt-12'>
                            <div className='flex w-auto px-1 py-2 space-x-4 bg-gray-300 border-b border-b-black'>
                                <span>Documento: </span>
                                <h2 className='flex font-bold'>{ingreso}</h2>
                            </div>
                            <table className='w-full border-b border-black'>
                                <thead>
                                    <tr className='[&>th]:font-semibold [&>th]:text-start [&>th]:py-2 bg-gray-600 text-white'>
                                        <th>Tercero</th>
                                        <th>Documento</th>
                                        <th>Recibo</th>
                                        <th>Valor</th>
                                        <th>Porcentaje</th>
                                        <th>Valor a pagar</th>
                                        <th>Fecha de pago</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm'>
                                    {
                                        liquidadas.map((liquidada, index) => (
                                            liquidada.strNombre == ingreso && (
                                                <tr key={index} className='[&>td]:py-2 [&>td]:font-medium'>
                                                    <td>{liquidada.strTercero}</td>
                                                    <td>{liquidada.strDocumento}</td>
                                                    <td>{liquidada.intRecibo}</td>
                                                    <td>{FormateoNumberInt(liquidada.intBaseMonto.toString())}</td>
                                                    <td>{liquidada.intValor}%</td>
                                                    <td>{FormateoNumberInt(((liquidada.intValor / 100) * parseInt(liquidada.intBaseMonto.toString())).toFixed(0))}</td>
                                                    <td>{(liquidada.dtFechaDocumento).toString().split(' ')[0]}</td>
                                                </tr>
                                            )
                                        ))
                                    }
                                </tbody>
                            </table>
                            <div className='flex space-x-4'>
                                <div className='flex px-6 py-1 my-2 space-x-2 text-white bg-gray-700 w-max rounded-xl'>
                                    <p className='uppercase '>TOTAL Valor {ingreso} :</p>
                                    <p>{FormateoNumberInt(calcular_valorXliquidacion(ingreso, 0).toFixed(0))}</p>
                                </div>
                                <div className='flex px-6 py-1 my-2 space-x-2 text-white bg-gray-700 w-max rounded-xl'>
                                    <p className='uppercase '>TOTAL valor a pagar {ingreso} :</p>
                                    <p>{FormateoNumberInt(calcular_valorXliquidacion(ingreso, 1).toFixed(0))}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )
            }
            <br />
            {alerts}
        </div>
    )
}
