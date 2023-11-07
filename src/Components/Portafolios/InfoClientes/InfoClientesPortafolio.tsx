import axios from '../../../Utils/BaseUrlAxio'
import React, { useEffect, useState } from 'react'
import { AiFillHome, AiFillPhone, AiOutlineUser, AiTwotoneMail } from 'react-icons/ai'
import { BiSolidCity } from 'react-icons/bi'
import { FaMoneyBillWave } from "react-icons/fa";
import { HiIdentification } from 'react-icons/hi'
import { ModalsLayout } from '../../Modals/ModalsLayout'
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from 'recharts'
import { RiCellphoneFill } from 'react-icons/ri'
import './stylesInfoClientes.css'

type InfoProps = {
    setviewInfoCliente: React.Dispatch<React.SetStateAction<boolean>>
    cedula: string
}

type ClienteData = {
    tipoId: string
    idTercero: string
    nombre: string
    nomCcial: string
    direcc1: string
    direcc2: string | null
    tel: string
    cel: string
    tel2: string | null
    intPlazo: number
    estado: string
    ciudad: string
    emailFE: string
    cupo: string
    flete: string
    descuento: string
    precioTercero: number
    descTipoTercero: string
    cartera: number | string | null
}


export const InfoClientesPortafolio: React.FC<InfoProps> = ({ setviewInfoCliente, cedula }) => {

    const [dataCliente, setdataCliente] = useState({} as ClienteData)
    const [dataGraficaProductos, setdataGraficaProductos] = useState([])
    const [topComprados, setTopComprados] = useState([])
    const [loadingGrafico, setloadingGrafico] = useState(true)
    const getRandomColor = () => {
        // Genera un color aleatorio en formato hexadecimal
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    useEffect(() => {
        GetDataClientes()
    }, [])


    const GetDataClientes = () => {
        axios.get(`/portafolios/data/Cliente/${cedula}`)
            .then((response) => {
                setTopComprados(response.data.topComprados)
                setdataCliente(response.data.data)
                setdataGraficaProductos(response.data.grafica)
                setloadingGrafico(false)
            }).catch((err) => {
                console.error(err)
            })
    }



    return (
        <ModalsLayout CloseEvent={setviewInfoCliente}>
            <div className='infoCliente_Container overflow-y-scroll '>
                <div className='flex flex-col justify-evenly items-center px-6 border-r-2 '>
                    <div className='flex justify-center items-center w-28 h-28 bg-sky-800 rounded-full my-6'>
                        <AiOutlineUser size={60} color={"white"} />
                    </div>
                    <div>
                        <p className='font-bold text-lg'>{dataCliente.nombre}</p>
                        <div className='flex items-center mt-5'>
                            <span className='mr-5'><HiIdentification size={20} /></span>
                            <span>{dataCliente.tipoId} - {dataCliente.idTercero}</span>
                        </div>
                        {/* {
                            (dataCliente.nomCcial).toString().trim() !== "" &&(
                                <p>{dataCliente.nomCcial}</p>
                            )
                        } */}
                        {
                            dataCliente.tel !== "" && (
                                <div className='flex items-center mt-5'>
                                    <span style={{ marginRight: '20px' }}><AiFillPhone size={20} /></span>
                                    <span>{dataCliente.tel}</span>
                                </div>
                            )
                        }
                        {
                            (dataCliente.cel !== "" && dataCliente.cel !== null) && (
                                <div className='flex items-center mt-5'>
                                    <span style={{ marginRight: '20px' }}><RiCellphoneFill size={20} /></span>
                                    <span>{dataCliente.cel}</span>
                                </div>
                            )
                        }
                        {
                            (dataCliente.direcc1 !== "" && dataCliente.direcc1 !== null) && (
                                <div className='flex items-center mt-5'>
                                    <span style={{ marginRight: '20px' }}><AiFillHome size={20} /></span>
                                    <span>{dataCliente.direcc1}</span>
                                </div>
                            )
                        }
                        <div className='flex items-center mt-5'>
                            <span className='mr-5'><BiSolidCity size={20} /></span>
                            <span>{dataCliente.ciudad}</span>
                        </div>
                        {
                            (dataCliente.emailFE !== "" && dataCliente.emailFE !== null) && (
                                <div className='flex items-center mt-5'>
                                    <span style={{ marginRight: '20px' }}><AiTwotoneMail size={20} /></span>
                                    <span>{dataCliente.emailFE}</span>
                                </div>
                            )
                        }
                        <div className='flex items-center mt-5'>
                            <span className='mr-5'><FaMoneyBillWave size={20} /></span>
                            <span>Precio {dataCliente.precioTercero}</span>
                        </div>
                    </div>
                    <button className='bg-sky-800 text-white py-2 px-12 my-12 w-auto rounded' onClick={() => { setviewInfoCliente(false) }}>Cerrar</button>

                </div>

                <div className='flex flex-col lg:w-1/2  justify-center items-center md:items-stretch px-12 border-r-2'>
                    <h1 className='text-3xl my-3 text-center'>INFORMACION GENERAL</h1>

                    <section className='grid sm:grid-cols-2 py-4 gap-4'>
                        <div className='flex items-center flex-col'>
                            <h4 className='font-bold text-lg text-sky-800'>Cupo</h4>
                            <span className='text-sm'>{dataCliente.cupo}</span>
                        </div>

                        <div className='flex items-center flex-col'>
                            <h4 className='font-bold text-lg text-sky-800'>Plazo</h4>
                            <span className='text-sm'>{dataCliente.intPlazo}</span>
                        </div>

                        <div className='flex items-center flex-col col-span-2'>
                            <h4 className='font-bold text-lg text-sky-800'>Flete</h4>
                            <span className='text-sm w-26 truncate'>{dataCliente.flete}</span>
                        </div>
                    </section>

                    <section className='grid sm:grid-cols-2 py-4 border-b-2 border-gray-400'>
                        <div className='flex items-center flex-col'>
                            <h4 className='font-bold text-lg text-sky-800'>Descuento</h4>
                            <span className='text-sm'>{dataCliente.descuento}</span>
                        </div>

                        <div className='flex items-center flex-col'>
                            <h4 className='font-bold text-lg text-sky-800'>Tipo Tercero</h4>
                            <span className='inline-block w-full truncate text-sm text-center'>{dataCliente.descTipoTercero}</span>
                        </div>
                    </section>

                    <section className='my-6 flex flex-col items-center'>
                        <h3 className='text-xl text-sky-800 font-bold'>Top productos mas comprados</h3>

                        <div>
                            {
                                topComprados.length !== 0 ? (
                                    <div style={{ marginTop: '30px', width: '100%', maxWidth: '100vw' }}>
                                        <BarChart width={320} height={250} data={topComprados}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey={"StrProducto"}/>
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey={"cantidades"} fill={'#75b628'} />
                                        </BarChart>
                                    </div>
                                ) : (
                                    <h2 >Sin datos</h2>
                                )
                            }

                        </div>
                    </section>
                </div>

                <div className='flex flex-col justify-center items-center px-6'>
                    <h3>Clases mas compradas</h3>

                    {
                        !loadingGrafico ? (
                            dataGraficaProductos.length !== 0 ? (
                                <ResponsiveContainer height={400} width={250}>
                                    <PieChart>
                                        <Legend />

                                        <Pie
                                            dataKey={"TotalCantidad"}
                                            data={dataGraficaProductos}
                                            innerRadius={50}
                                            outerRadius={120}
                                            nameKey={"StrDescripcion"}
                                        >

                                            {
                                                dataGraficaProductos.map((item, index) => (
                                                    <Cell key={`${index}-${item}`} fill={getRandomColor()}></Cell>
                                                ))
                                            }

                                        </Pie>
                                        <Tooltip />

                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <h1>Sin datos</h1>
                            )

                        ) :
                            (
                                <h1>Cargando..</h1>
                            )
                    }
                </div>

            </div>
        </ModalsLayout>
    )
}
