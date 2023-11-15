import React, { useState, useEffect } from 'react'
import { LoaderInfo } from '../../Components/LoaderInfo/LoaderInfo'
import { useAlert } from '../../hooks/useAlert'
import { AgregarAlerta, FormateoNumberInt } from '../../Utils/Helpers'
import axios from '../../Utils/BaseUrlAxio'
import moment from 'moment'

type PropsCartera = {
    setLoadingMovimiento: React.Dispatch<React.SetStateAction<boolean>>
    LoadingMovimiento: boolean
    strIdVendedor: string
    setTotal: React.Dispatch<React.SetStateAction<number>>
}

type Cartera = {
    "StrIdTercero": String,
    "StrNombre": String,
    "IntTransaccion": String,
    "IntDocumento": number,
    "DatFecha": Date,
    "DatVencimiento": Date,
    "IntTotal": number,
    "IntSaldoF": number,
    "StrDescripcion": String,
    "IntEdadDoc": number,
    "StrTelefono": String,
    "StrCelular": String,
    "IntCupo": String,
    "IntPlazo": number,
    "StrContactoCartera": String,
    "IdVendedor": String,
    "VendedorNombre": String,
    "StrCargo": String,
    "StrCiudad": String,
    "IntTipoTercero": String,
    "Expr1": String,
    "StrDireccion": String,
    "StrDireccion2": String,
    "IntDocRef": String

}

export const Cartera_Movimientos: React.FC<PropsCartera> = ({ setLoadingMovimiento, LoadingMovimiento, strIdVendedor, setTotal }) => {

    const { alerts, createToast } = useAlert()
    const [cartera, setcartera] = useState<Cartera[]>([] as Cartera[])
    const [cartera_ciudades, setcartera_ciudades] = useState<Cartera[]>([] as Cartera[])

    useEffect(() => {
        moment.locale('es-mx')
        ConsultarCarteraVendedor()
    }, [])

    useEffect(() => {
        if (cartera.length > 0) {
            Calcular_Total()
        }
    }, [cartera])



    const ConsultarCarteraVendedor = async () => {
        setLoadingMovimiento(true)
        try {
            const response = await axios.get(`/movimientos/cartera?strIdVendedor=${strIdVendedor}`)
            if (response.status == 200) {
                const response_Ciudades = await axios.get(`movimientos/cartera_ciudades?strIdVendedor=${strIdVendedor}`)

                setLoadingMovimiento(false)
                setcartera(response.data.data)
                setcartera_ciudades(response_Ciudades.data.data)

            }
        } catch (error) {
            console.log(error)
            AgregarAlerta(createToast, `${error}`, 'danger')
        }
    }

    const Calcular_Total = () => {
        try {
            let total = 0;

            cartera.forEach((element) => {
                total += parseInt((element.IntSaldoF).toFixed(0))
            })

            setTotal(total)
        } catch (error) {
            AgregarAlerta(createToast, `${error}`, 'danger')
        }
    }

    return (
        <div>
            {
                LoadingMovimiento ? (
                    <div className='flex items-center w-full mt-32 flex-col space-y-2'>
                        <LoaderInfo />
                        <span className='text-md font-medium text-gray-600'>Cargando Cartera...</span>
                    </div>
                ) : (
                    <>
                        <h3 className='text-2xl'>Propias</h3>
                        <section className='h-[450px] overflow-y-scroll'>

                            <table className=' w-full border-b border-b-gray-800'>
                                <thead className='border-b border-gray-400'>
                                    <tr className='[&>th]:font-semibold [&>th]:text-start [&>th]:py-2'>
                                        <th className='w-20'>Doc</th>
                                        <th>Cliente</th>
                                        <th>Fecha generada</th>
                                        <th>Fecha vencimiento</th>
                                        <th>Total</th>
                                        <th>Ciudad</th>
                                        <th>Tiempo</th>
                                        <th>Celular</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cartera.map((cartera, index) => (
                                            <tr key={index} className='[&>td]:py-4 border-b border-b-gray-300 [&>td]:font-medium [&>td]:text-sm'>
                                                <td>{cartera.IntDocumento}</td>
                                                <td>{cartera.StrNombre}</td>
                                                <td>{moment(cartera.DatFecha).format('lll')}</td>
                                                <td>{moment(cartera.DatVencimiento).format('lll')}</td>
                                                <td>{FormateoNumberInt(cartera.IntSaldoF.toFixed(0))}</td>
                                                <td>{cartera.StrDescripcion}</td>
                                                <td className={`${cartera.IntEdadDoc < -9 && 'bg-lime-300'} ${(cartera.IntEdadDoc < -2 && cartera.IntEdadDoc > -10) && 'bg-yellow-200'} ${cartera.IntEdadDoc > -2 && 'bg-red-200'}`}>
                                                    <span className='px-4'>{cartera.IntEdadDoc}</span>
                                                </td>
                                                <td>{cartera.StrCelular}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </section>

                        <h3 className='text-2xl mt-12'>Oportunidad de recaudo</h3>
                        <section className='h-[450px] overflow-y-scroll'>

                            <table className=' w-full border-b border-b-gray-800'>
                                <thead className='border-b border-gray-400'>
                                    <tr className='[&>th]:font-semibold [&>th]:text-start [&>th]:py-2'>
                                        <th className='w-20'>Doc</th>
                                        <th>Cliente</th>
                                        <th>Fecha generada</th>
                                        <th>Fecha vencimiento</th>
                                        <th>Total</th>
                                        <th>Ciudad</th>
                                        <th>Tiempo</th>
                                        <th>Celular</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cartera_ciudades.map((cartera, index) => (
                                            <tr key={index} className='[&>td]:py-4 border-b border-b-gray-300 [&>td]:font-medium [&>td]:text-sm'>
                                                <td>{cartera.IntDocumento}</td>
                                                <td>{cartera.StrNombre}</td>
                                                <td>{moment(cartera.DatFecha).format('lll')}</td>
                                                <td>{moment(cartera.DatVencimiento).format('lll')}</td>
                                                <td>{FormateoNumberInt(cartera.IntSaldoF.toFixed(0))}</td>
                                                <td>{cartera.StrDescripcion}</td>
                                                <td className={`${cartera.IntEdadDoc < -9 && 'bg-lime-300'} ${(cartera.IntEdadDoc < -2 && cartera.IntEdadDoc > -10) && 'bg-yellow-200'} ${cartera.IntEdadDoc > -2 && 'bg-red-200'}`}>
                                                    <span className='px-4'>{cartera.IntEdadDoc}</span>
                                                </td>
                                                <td>{cartera.StrCelular}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </section>
                    </>
                )
            }
            <br />
            <br />
            {alerts}
        </div>
    )
}
