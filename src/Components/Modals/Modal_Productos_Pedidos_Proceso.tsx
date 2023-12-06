import React, { useEffect, useState } from 'react'
import { ModalsLayout } from './ModalsLayout'
import axios from '../../Utils/BaseUrlAxio'
import { FormateoNumberInt, URLIMAGENESPRODUCTOS } from '../../Utils/Helpers'

interface IPropsComponent {
    CloseEvent: React.Dispatch<React.SetStateAction<boolean>>
    id: number
}

interface IPropsProductos {
    "intIdPedDetalle": number,
    "intIdPedido": number,
    "strIdProducto": string,
    "strDescripcion": string,
    "intCantidad": number,
    "strUnidadMedida": string,
    "strObservacion": string,
    "intPrecio": number,
    "strRutaImg": string,
    "intEstado": number
}

export const Modal_Productos_Pedidos_Proceso: React.FC<IPropsComponent> = ({ CloseEvent, id }) => {

    const [productos, setproductos] = useState<IPropsProductos[]>([])

    useEffect(() => {
        consultarProductosPedido()
    }, [])


    const consultarProductosPedido = async () => {
        try {
            const response = await axios.get(`/proceso_pedidos/detalles/?id=${id}`)
            setproductos(response.data.productos)
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <ModalsLayout CloseEvent={CloseEvent}>
            <section className='bg-white z-20 w-3/4 min-h-[300px] max-h-[600px] p-4 overflow-y-scroll'>
                <p className='text-2xl text-slate-600 font-bold'>Informacion del pedido</p>
                {
                    productos.length > 0 ? (
                        <table className='w-full mt-4'>
                            <thead>
                                <tr className='border-2 border-gray-200 [&>th]:py-12'>
                                    <th>Foto</th>
                                    <th>Referencia</th>
                                    <th>Observacion</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    productos.map((producto) => (
                                        <tr key={producto.intIdPedDetalle} className='[&>td]:text-center border-2 border-gray-200 text-slate-600 text-base'>
                                            <td className='w-20 h-20'>
                                                <img src={`${URLIMAGENESPRODUCTOS}/${producto.strRutaImg}`} alt='' className='w-full h-full' />
                                            </td>
                                            <td>{producto.strIdProducto}</td>
                                            <td>{producto.strObservacion}</td>
                                            <td>{producto.intCantidad}</td>
                                            <td>{FormateoNumberInt((producto.intPrecio).toString())}</td>
                                            <td>{FormateoNumberInt((producto.intCantidad * producto.intPrecio).toString())}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    ) : (
                        <article className='w-full h-full flex justify-center items-center'>
                            <p className='text-lg font-medium text-slate-500'>No hay productos registrados</p>
                        </article>
                    )
                }

                <div className='relative py-4'>
                    <button onClick={()=>{CloseEvent(false)}} className='absolute right-4 bg-blue-500 text-white px-8 py-2 rounded-md'>Cerrar</button>
                </div>
                <br />
            </section>
        </ModalsLayout>
    )
}
