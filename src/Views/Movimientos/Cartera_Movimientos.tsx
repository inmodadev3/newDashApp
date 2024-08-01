import React, { useState, useEffect } from 'react'
import { LoaderInfo } from '../../Components/LoaderInfo/LoaderInfo'
import { useAlert } from '../../hooks/useAlert'
import { AgregarAlerta, fechaParseada, FormateoNumberInt, quitarAcentos } from '../../Utils/Helpers'
import axios from '../../Utils/BaseUrlAxio'

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
    const [carteraCopy, setcarteraCopy] = useState<Cartera[]>([] as Cartera[])
    const [texto_buscador, settexto_buscador] = useState('')

    const [cartera_ciudades, setcartera_ciudades] = useState<Cartera[]>([] as Cartera[])
    const [cartera_ciudadesCopy, setcartera_ciudadesCopy] = useState<Cartera[]>([] as Cartera[])
    const [texto_buscador_oportunidades, settexto_buscador_oportunidades] = useState('')

    useEffect(() => {
        ConsultarCarteraVendedor()
    }, [])

    useEffect(() => {
        if (cartera.length > 0) {
            Calcular_Total()
        }
    }, [cartera])

    useEffect(() => {
        Buscar()
    }, [texto_buscador])

    useEffect(() => {
        Buscar_oportunidades()
    }, [texto_buscador_oportunidades])




    const ConsultarCarteraVendedor = async () => {
        setLoadingMovimiento(true)
        try {
            const response = await axios.get(`/movimientos/cartera?strIdVendedor=${strIdVendedor}`)
            if (response.status == 200) {
                setLoadingMovimiento(false)
                setcartera(response.data.data)
                setcarteraCopy(response.data.data)


                const response_Ciudades = await axios.get(`movimientos/cartera_ciudades?strIdVendedor=${strIdVendedor}`)
                setcartera_ciudades(response_Ciudades.data.data)
                setcartera_ciudadesCopy(response_Ciudades.data.data)

            }
        } catch (error) {
            console.error(error)
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

    const handleChangeBuscador = (e: React.ChangeEvent<HTMLInputElement>) => {
        settexto_buscador(e.target.value)
    }

    const handleChangeBuscadorOportunidades = (e: React.ChangeEvent<HTMLInputElement>) => {
        settexto_buscador_oportunidades(e.target.value)
    }

    const Buscar = () => {
        const data: Cartera[] = carteraCopy
        const texto_buscadorSinAcentos = quitarAcentos(texto_buscador.toLowerCase());

        const encontradas = data.filter((item) =>
            quitarAcentos(item.StrDescripcion.toLowerCase()).includes(texto_buscadorSinAcentos) ||
            item.StrNombre.toLowerCase().includes(texto_buscador.toLowerCase()) ||
            item.StrIdTercero.includes(texto_buscador)
        );

        setcartera(encontradas)
    }

    const Buscar_oportunidades = () => {
        const data: Cartera[] = cartera_ciudadesCopy
        const texto_buscadorSinAcentos = quitarAcentos(texto_buscador_oportunidades.toLowerCase());

        const encontradas = data.filter((item) =>
            quitarAcentos(item.StrDescripcion.toLowerCase()).includes(texto_buscadorSinAcentos) ||
            item.StrNombre.toLowerCase().includes(texto_buscador_oportunidades.toLowerCase()) ||
            item.StrIdTercero.includes(texto_buscador_oportunidades)
        )


        setcartera_ciudades(encontradas)
    }

    return (
        <div>
            <input
                type='text'
                placeholder='Buscar por nombre, documento o ciudad'
                aria-label='Buscar factura por nombre, documento o ciudad'
                className='w-full px-4 py-2 my-2 border-2 rounded outline-none border-slate-700'
                value={texto_buscador}
                onChange={handleChangeBuscador}
            />
            {
                LoadingMovimiento ? (
                    <div className='flex flex-col items-center w-full mt-32 space-y-2'>
                        <LoaderInfo />
                        <span className='font-medium text-gray-600 text-md'>Cargando Cartera...</span>
                    </div>
                ) : (
                    <>
                        <h3 className='text-2xl'>Propias</h3>
                        <section className='h-[450px] overflow-y-scroll'>

                            <table className='w-full border-b border-b-gray-800'>
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
                                                <td>{fechaParseada(cartera.DatFecha)}</td>
                                                <td>{fechaParseada(cartera.DatVencimiento)}</td>
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

                        <h3 className='mt-12 text-2xl'>Oportunidad de recaudo</h3>

                        <input
                            type='text'
                            placeholder='Buscar por nombre, documento o ciudad'
                            aria-label='Buscar factura por nombre, documento o ciudad'
                            className='w-full px-4 py-2 my-2 border-2 rounded outline-none border-slate-700'
                            value={texto_buscador_oportunidades}
                            onChange={handleChangeBuscadorOportunidades}
                        />
                        <section className='h-[450px] overflow-y-scroll'>

                            <table className='w-full border-b border-b-gray-800'>
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
                                                <td>{fechaParseada(cartera.DatFecha)}</td>
                                                <td>{fechaParseada(cartera.DatVencimiento)}</td>
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
