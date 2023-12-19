import React, { useEffect, useState } from 'react'
import { LoaderInfo } from '../../Components/LoaderInfo/LoaderInfo'
import { AgregarAlerta, FormateoNumberInt } from '../../Utils/Helpers'
import { useAlert } from '../../hooks/useAlert'
import axios from '../../Utils/BaseUrlAxio'

type PropsFacturas = {
    setLoadingMovimiento: React.Dispatch<React.SetStateAction<boolean>>
    LoadingMovimiento: boolean
    mes: number
    año: number
    strIdVendedor: string
    setTotal: React.Dispatch<React.SetStateAction<number>>
}

type Facturas = {
    IntDocumento: number,
    IntIva: number
    IntTotal: number
    IntTransaccion: string,
    IntValor: number,
    StrDVendedor: string
    StrDescripcion: string,
    StrNombre: string,
    Vendedor: string
}

export const Facturas_Movimientos: React.FC<PropsFacturas> = ({ setLoadingMovimiento, LoadingMovimiento, mes, año, strIdVendedor, setTotal }) => {

    const { alerts, createToast } = useAlert()
    const [facturas, setfacturas] = useState<Facturas[]>([] as Facturas[])
    const [facturasCopy, setfacturasCopy] = useState<Facturas[]>([] as Facturas[])
    const [texto_buscador, settexto_buscador] = useState('')

    useEffect(() => {
        if (mes !== 0 && año !== 0) {
            ConsultarFacturas()
        }
    }, [mes, año])

    useEffect(() => {
        if (facturas.length > 0) {
            Calcular_Total()
        }
    }, [facturas])

    useEffect(() => {
        Buscar()
    }, [texto_buscador])




    const ConsultarFacturas = async () => {
        try {
            if (strIdVendedor !== '1') {
                const response = await axios.get(`/movimientos/facturas?mes=${mes}&año=${año}&strIdVendedor=${strIdVendedor}`)
                if (response.status == 200) {
                    setLoadingMovimiento(false)
                    setfacturas(response.data.data)
                    setfacturasCopy(response.data.data)
                }
            } else {
                AgregarAlerta(createToast, `Ha ocurrido un error con la cedula del vendedor`, 'warning')

            }
        } catch (error) {
            AgregarAlerta(createToast, `${error}`, 'danger')
        }
    }

    const Calcular_Total = () => {
        try {
            let total = 0;
            facturas.forEach(element => {
                total += parseInt((element.IntTotal).toFixed(0))
            });

            setTotal(total)
        } catch (error) {
            AgregarAlerta(createToast, `${error}`, 'danger')
        }
    }

    const handleChangeBuscador = (e: React.ChangeEvent<HTMLInputElement>) => {
        settexto_buscador(e.target.value)
    }

    const Buscar = () => {
        const data: Facturas[] = facturasCopy
        const encontradas: Facturas[] = data.filter((item) =>
            item.StrNombre.toLowerCase().includes(texto_buscador.toLowerCase())||
            item.IntDocumento.toString().includes(texto_buscador)
        );
        setfacturas(encontradas)

    }

    return (
        <div className='min-w-full'>

            <input
                type='text'
                placeholder='Buscar por nombre o numero de documento'
                aria-label='Buscar factura por nombre o numero de documento'
                className='w-full border-2 border-slate-700 outline-none px-4 py-2 rounded my-2'
                value={texto_buscador}
                onChange={handleChangeBuscador}
            />
            {
                LoadingMovimiento ? (
                    <div className='flex items-center w-full mt-32 flex-col space-y-2'>
                        <LoaderInfo />
                        <span className='text-md font-medium text-gray-600'>Cargando Facturas...</span>
                    </div>
                ) : (
                    <section className='h-[430px] overflow-y-scroll'>
                        <table className=' w-full border-b border-b-gray-800 '>
                            <thead className='border-b border-gray-400'>
                                <tr className='[&>th]:font-semibold [&>th]:text-start [&>th]:py-2'>
                                    <th className='w-20'>Doc</th>
                                    <th>Tipo</th>
                                    <th>Cliente</th>
                                    <th>SubTotal</th>
                                    <th>Iva</th>
                                    <th>Total</th>
                                    <th>vendedor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    facturas.map((factura, index) => (
                                        <tr key={index} className='[&>td]:py-4 border-b border-b-gray-300 [&>td]:font-medium [&>td]:text-sm hover:bg-gray-300'>
                                            <td>{factura.IntDocumento}</td>
                                            <td>{factura.StrDescripcion}</td>
                                            <td>{factura.StrNombre}</td>
                                            <td>${FormateoNumberInt((factura.IntValor).toFixed(0).toString())}</td>
                                            <td>${FormateoNumberInt((factura.IntIva).toFixed(0).toString())}</td>
                                            <td>${FormateoNumberInt((factura.IntTotal).toFixed(0).toString())}</td>
                                            <td className='flex flex-col'>
                                                <span>{factura.Vendedor}</span>
                                                <span className='text-gray-600'>{factura.StrDVendedor}</span>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <br />
                        <br />
                        <br />
                    </section>
                )
            }
            {alerts}
        </div>
    )
}
