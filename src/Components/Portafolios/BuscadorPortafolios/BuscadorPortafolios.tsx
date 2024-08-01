import axios from '../../../Utils/BaseUrlAxio'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import './BuscadorPortafolios.css'

interface IDataPropsPortafolio {
    Estado: string
    Nombre_tercero: string,
    StrIdTercero: string
    Viaja: string
    ciudad: string
    barrio:string
    ultima_Compra: number
    ultima_gestion: Date
}

type propsBuscador = {
    setdatosClientes: React.Dispatch<React.SetStateAction<IDataPropsPortafolio[] | null>>
    setPaginas: React.Dispatch<React.SetStateAction<number>>
    paginas: number
    setPagina: React.Dispatch<React.SetStateAction<number>>
    pagina: number
    cedulaVendedor: string
    setloadingData: React.Dispatch<React.SetStateAction<boolean>>
}

type Tciudades = {
    StrDescripcion: string
    StrIdCiudad: string
}

export const BuscadorPortafolios: React.FC<propsBuscador> = ({ setdatosClientes, cedulaVendedor, setPaginas, paginas, pagina, setPagina, setloadingData }) => {

    const [inputValue, setinputValue] = useState('')
    const [selectValue, setselectValue] = useState<string>("0")
    const [arrayCiudades, setarrayCiudades] = useState<Tciudades[] | null>(null)
    const [ciudadSelected, setciudadSelected] = useState("Todas")
    const [ciudadIdSelected, setciudadIdSelected] = useState("0")
    const [selectValueSegmentos, setselectValueSegmentos] = useState("0")




    useEffect(() => {
        if (cedulaVendedor) {
            consultarCiudadesVendedor()
            consultarListaClientesXVendedorXNombre()
        }
    }, [cedulaVendedor])

    useEffect(() => {
        let timer: number = 0;

        clearTimeout(timer);
        timer = setTimeout(() => {
            consultarClientesXciudad(ciudadIdSelected)
        }, 800);
        return () => {
            clearTimeout(timer)
        }
    }, [pagina])


    useEffect(() => {
        let timer: number = 0;

        clearTimeout(timer);
        timer = setTimeout(() => {
            if (arrayCiudades !== null) {
                const selectedCiudad = arrayCiudades.find(ciudad => ciudad.StrDescripcion.toLowerCase() === ciudadSelected.toLowerCase())
                if (selectedCiudad || ciudadIdSelected == "0") {
                    consultarClientesXciudad(ciudadIdSelected)
                    setselectValueSegmentos("0")
                    setPagina(0)
                    setdatosClientes([])
                }
            }
        }, 800);
        return () => {
            clearTimeout(timer)
        }
    }, [ciudadIdSelected])


    const consultarListaClientesXVendedorXNombre = () => {
        setloadingData(true)
        axios.post(`/portafolios/nombre?pag=${pagina}`, {
            vendedorId: cedulaVendedor,
            clienteNombre: inputValue
        }).then((response) => {
            setPaginas(response.data.pags)
            setdatosClientes(response.data.data)
        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            setloadingData(false)
        })


    }

    const consultarListaClientesXVendedorXCedula = () => {
        axios.post(`/portafolios/id`, {
            vendedorId: cedulaVendedor,
            clienteId: inputValue
        }).then((response) => {
            setdatosClientes(response.data.data)
        }).catch((err) => {
            console.error(err)
        })
    }

    const consultarCiudadesVendedor = () => {
        axios.post('/portafolios/ciudades', {
            vendedorId: cedulaVendedor,
        }).then((response) => {
            setarrayCiudades(response.data.data)
        }).catch((err) => {
            console.error(err)
        })
    }

    const consultarClientesXciudad = (ciudadId: string, segmentoInt: string | number = 0) => {
        setloadingData(true)
        if (ciudadId !== "0") {

            axios.post(`/portafolios/clientes_ciudades?pag=${pagina}`, {
                ciudadId,
                segmentoInt
            }).then((response) => {
                setPaginas(response.data.pags)
                setdatosClientes(response.data.data)
            }).catch((err) => {
                console.error(err)
            }).finally(() => {
                setloadingData(false)
            })
        } else {
            consultarListaClientesXVendedorXNombre()
        }

    }

    const BuscarCliente = () => {
        switch (selectValue) {
            case '0':
                setPagina(0)

                consultarListaClientesXVendedorXNombre()
                break;

            case '1':
                consultarListaClientesXVendedorXCedula()
                break;

            default:
                consultarListaClientesXVendedorXNombre()
                break;
        }
    }

    const PaginaAnterior = () => {
        setPagina((pagina) => pagina !== 0 ? pagina - 1 : pagina)
    }

    const PaginaSiguiente = () => {
        setPagina((pagina) => pagina !== paginas - 1 ? pagina + 1 : pagina)
    }

    const HandleChangePagina = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (!isNaN(parseInt(value))) {
            setPagina(parseInt(value))
        } else {
            setPagina(0)
        }
    }

    const handleCiudadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDescripcion = e.target.value;

        if (selectedDescripcion.toLowerCase() == "todas") {
            setciudadIdSelected("0")
            setciudadSelected("Todas");
            return;
        }

        if (arrayCiudades !== null) {
            const selectedCiudad = arrayCiudades.find(ciudad => ciudad.StrDescripcion.toLowerCase() === selectedDescripcion.toLowerCase());
            setciudadIdSelected(selectedCiudad ? selectedCiudad.StrIdCiudad : "0")
            setciudadSelected(e.target.value);
        }
    };


    arrayCiudades?.sort((a, b) => {
        if (a.StrDescripcion < b.StrDescripcion) {
            return -1;
        }
        if (a.StrDescripcion > b.StrDescripcion) {
            return 1;
        }
        return 0;
    });

    return (
        <section className='pt-4'>
            <div className='flex flex-row gap-x-4'>
                <select onChange={(e) => { setselectValue(e.target.value) }} className='relative items-center w-full px-4 py-2 my-2 border md:w-1/2 border-sky-950 rounded-3xl'>
                    <option value={0}>Nombre</option>
                    <option value={1}>Cedula</option>
                </select>

                {
                    arrayCiudades !== null && (
                        <>
                            <div className='relative items-center w-full px-4 py-2 my-2 border md:w-1/2 border-sky-950 rounded-3xl'>
                                <input
                                    list="ciudades"
                                    name="ciudades"
                                    value={ciudadSelected}
                                    className='w-full h-full outline-none'
                                    onChange={handleCiudadChange}
                                />

                                <datalist id="ciudades">
                                    <option value={"Todas"} label='Todas' />
                                    {arrayCiudades.map((ciudad) => (
                                        <option key={ciudad.StrIdCiudad} value={ciudad.StrDescripcion} />
                                    ))}
                                </datalist>
                            </div>
                            {/* <select
                                defaultValue={0}
                                className='relative items-center w-full px-4 py-2 my-2 border md:w-1/2 border-sky-950 rounded-3xl'
                                onChange={(e) => {
                                    consultarClientesXciudad(e.target.value)
                                    setciudadSelected(e.target.value)
                                    setselectValueSegmentos("0")
                                    setPagina(0)
                                    setdatosClientes([])
                                }}
                            >
                                <option value={0}>Todas</option>
                                {
                                    arrayCiudades.map((ciudad) => (
                                        <option key={ciudad.StrIdCiudad} value={ciudad.StrIdCiudad}>{ciudad.StrDescripcion}</option>
                                    ))
                                }
                            </select> */}
                        </>
                    )
                }
            </div>
            <div className='flex items-center gap-x-4'>
                <div className='relative flex items-center w-full my-4 border md:w-1/2 border-sky-950 rounded-3xl'>
                    <input
                        type='text'
                        className='w-full px-4 py-2 bg-transparent outline-none'
                        onKeyUp={(e) => {
                            if (e.keyCode === 13) {
                                BuscarCliente()
                            }
                        }}
                        value={inputValue}
                        onChange={(e) => {
                            setinputValue(e.target.value)
                        }}
                        placeholder={`Digite ${selectValue === "0" ? "un nombre" : "una cedula"}`}
                    />
                    <span className='absolute p-2 transition-all duration-300 cursor-pointer right-3 hover:text-lime-500' onClick={BuscarCliente}><AiOutlineSearch size={24} /></span>
                </div>

                {
                    (ciudadSelected.toString() !== "" && ciudadIdSelected !== "0") &&
                    (
                        <select value={selectValueSegmentos} onChange={(e) => {
                            setselectValueSegmentos(e.target.value)
                            consultarClientesXciudad(ciudadSelected, e.target.value)
                        }} className='relative items-center w-full px-4 py-2 my-2 border md:w-1/2 border-sky-950 rounded-3xl'>
                            <option disabled value={0} className='text-gray-400'>Seleccione un segmento</option>
                            <option value={"0"}>Todos los segmentos</option>
                            <option value={"01"}>Segmento 1</option>
                            <option value={"02"}>Segmento 2</option>
                            <option value={"03"}>Segmento 3</option>
                        </select>
                    )
                }
            </div>
            <div className='flex gap-x-6'>
                <p>Paginas: <span className='font-bold '>{paginas}</span></p>
                <label className='flex gap-x-4'>
                    <button onClick={PaginaAnterior} className='px-4 py-1 text-white bg-blue-600 rounded'>Anterior</button>
                    <input
                        type='number'
                        value={pagina}
                        className='w-12 text-center border border-gray-300 outline-none '
                        min={0}
                        max={paginas}
                        onChange={HandleChangePagina}
                    />
                    <button onClick={PaginaSiguiente} className='px-4 py-1 text-white bg-blue-600 rounded'>Siguiente</button>

                </label>
            </div>
            <br />


        </section>
    )
}
