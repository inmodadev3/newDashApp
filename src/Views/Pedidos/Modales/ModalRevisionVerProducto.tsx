import React, { useEffect, useState } from 'react'
import { ModalsLayout } from '../../../Components/Modals/ModalsLayout'
import axios from '../../../Utils/BaseUrlAxio'
import { ImagenNotFound, URLIMAGENESPRODUCTOS } from '../../../Utils/Helpers'
import { Loader } from '../../../Components/LoadingPage/Loader'

type TProps = {
    setisViewModalInfoProducto: React.Dispatch<React.SetStateAction<boolean>>
    referenciaInfoProducto: string
}

type TProductoData = {
    "referencia": string,
    "descripcion": string,
    "UM": string,
    "cantxEmpaque": string,
    "Ubicacion": string,
    "medida": string,
    "productoImg": string,
    "saldoInv": number
}

export const ModalRevisionVerProducto: React.FC<TProps> = ({
    setisViewModalInfoProducto,
    referenciaInfoProducto
}) => {

    const [infoProducto, setinfoProducto] = useState<TProductoData>({} as TProductoData)
    const [isLoadingData, setisLoadingData] = useState(false)

    useEffect(() => {
        consultarInfoProducto()
    }, [])

    const consultarInfoProducto = async () => {
        setisLoadingData(true)
        try {
            const { data } = await axios.get(`/productos/id/${referenciaInfoProducto}`)
            setinfoProducto(data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setisLoadingData(false)
        }
    }

    return (
        <ModalsLayout CloseEvent={setisViewModalInfoProducto}>
            <section className='z-30 flex flex-col xl:flex-row w-auto items-center xl:items-start xl:px-12 py-4 bg-white rounded h-5/6 gap-x-5 overflow-scroll'>
                {
                    isLoadingData ? (
                        <Loader />
                    ) : (
                        <>
                            <div className='flex items-center justify-center w-1/2 h-full'>
                                <figure className='max-w-[400px] max-h-[500px]'>
                                    <img
                                        src={URLIMAGENESPRODUCTOS + infoProducto.productoImg}
                                        className='object-contain w-auto h-auto'
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = ImagenNotFound
                                        }}
                                    />
                                </figure>
                            </div>

                            <article className='flex flex-col justify-start w-1/2 h-full text-lg'>
                                <p className='font-bold text-center'>{infoProducto.descripcion}</p>
                                <section className='flex flex-col mx-auto my-auto gap-y-4'>
                                    <p className='font-bold'>Referencia: <span className='font-normal'>{infoProducto.referencia}</span></p>
                                    <p className='font-bold'>Unidad Medida: <span className='font-normal'>{infoProducto.UM}</span></p>
                                    <p className='font-bold'>Cantidad empaque: <span className='font-normal'>{infoProducto.cantxEmpaque}</span></p>
                                    <p className='font-bold'>Tamaño : <span className='font-normal'>{infoProducto.medida}</span></p>
                                    <p className='font-bold'>Ubicación : <span className='font-normal'>{infoProducto.Ubicacion}</span></p>
                                    <p className='font-bold'>Inventario : <span className='font-normal'>{infoProducto.saldoInv}</span></p>
                                </section>

                            </article>
                        </>
                    )
                }

            </section>
        </ModalsLayout>
    )
}
