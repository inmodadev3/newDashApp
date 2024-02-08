import { IArrayProductos } from "../../Utils/GlobalInterfaces"
import { FormateoNumberInt, ImagenNotFound, URLIMAGENESPRODUCTOS } from "../../Utils/Helpers"
import React, { useState } from "react"
import './Styles/stylesProductoCard.css'
import axios from "../../Utils/BaseUrlAxio"

interface IArrayImagenes {
    StrArchivo: string
}

interface CardProps {
    producto:IArrayProductos,
    editar_ubicacion:boolean,
    setviewModalEditarUbicacion: React.Dispatch<React.SetStateAction<boolean>>
    setproducto_editar: React.Dispatch<React.SetStateAction<IArrayProductos>>
}

export const ProductoCard: React.FC<CardProps> = ({ producto, editar_ubicacion,setviewModalEditarUbicacion,setproducto_editar }) => {

    const [ViewImage, setViewImage] = useState(false)
    const [arrayImagenes, setarrayImagenes] = useState<IArrayImagenes[]>([])
    const [imagenCount, setimagenCount] = useState<string | null>(producto.productoImg)

    const ConsultarImagenesProducto = () => {
        axios.get(`/productos/imagenes/${producto.referencia}`)
            .then((response) => {
                setarrayImagenes(response.data.data)
            }).catch((err) => {
                console.error(err)
            })
    }

    const Activar_Modal_EditarUbicaciones = () =>{
        setviewModalEditarUbicacion(true)
        setproducto_editar(producto)
    }

    return (
        <>
            <div className="flex flex-col justify-between w-full h-full max-w-2xl border-2 border-gray-300 rounded lg:flex-row">
                <figure
                    className="flex w-full h-full bg-white border-b-2 border-gray-400 cursor-pointer lg:w-1/2 lg:border-b-0"
                    onClick={() => {
                        setViewImage(true)
                        setimagenCount(producto.productoImg !== null ? URLIMAGENESPRODUCTOS + producto.productoImg : ImagenNotFound)
                        ConsultarImagenesProducto()
                    }}>
                    <img src={URLIMAGENESPRODUCTOS + producto.productoImg ? producto.productoImg !== null ? URLIMAGENESPRODUCTOS + producto.productoImg : ImagenNotFound : ImagenNotFound} alt="Imagen Producto" className="object-contain w-full h-full" />
                </figure>
                <div className="flex flex-col w-full px-5 bg-gray-300/10 lg:w-1/2 gap-y-2 lg:border-l-2">
                    <span className="text-lg font-bold underline text-sky-950">{producto.descripcion}</span>
                    <div>
                        <span className={"font-bold text-sky-950 text-lg"}>Referencia : </span>
                        <span>{producto.referencia}</span>
                    </div>
                    <div>
                        <span className={"font-bold text-sky-950 text-lg"}>Unidad Medida : </span>
                        <span>{producto.UM}</span>
                    </div>
                    <div>
                        <span className={"font-bold text-sky-950 text-lg"}>Tamaño :</span>
                        <span>{producto.medida}</span>
                    </div>
                    <div>
                        <span className={"font-bold text-sky-950 text-lg"}>Cantidad empaque : </span>
                        <span>{producto.cantxEmpaque}</span>
                    </div>
                    <div>
                        <span className={"font-bold text-sky-950 text-lg"}>Precio : </span>
                        <span>${FormateoNumberInt((producto.precio).toString())}</span>
                    </div>
                    <div>
                        <span className={"font-bold text-sky-950 text-lg"}>Ubicación : </span>
                        <span>{producto.Ubicacion}</span>
                    </div>
                    <div>
                        <span className={"font-bold text-sky-950 text-lg"}>{(producto.saldoInv !== null && parseInt(parseInt(producto.saldoInv).toFixed(0)) > 0) ? "Inventario : ": "Sin inventario"} </span>
                        <span>{producto.saldoInv !== null ? parseInt(producto.saldoInv).toFixed(0) : ""}</span>
                    </div>
                    {
                        editar_ubicacion && (
                            <div className="py-2">
                                <button 
                                    onClick={Activar_Modal_EditarUbicaciones}
                                    className="px-3 py-1 text-white bg-blue-600 rounded"
                                 >Editar ubicación</button>
                            </div>
                        )
                    }
                    
                </div>
            </div>

            <div className={`CarruselImagenesContainer ${ViewImage ? "ViewTrue" : ""}`} >
                <div
                    className="closeContainerCarrusel"
                    onClick={() => {
                        setViewImage(false)
                        setTimeout(() => {
                            setimagenCount(null)
                        }, 200);
                    }}>

                </div>
                <div>

                </div>
                <div className="ImageCarrusel">
                    <img src={imagenCount ? imagenCount : ImagenNotFound} onClick={() => {
                        setViewImage(false)
                        setTimeout(() => {
                            setimagenCount(null)
                        }, 200);
                    }} />
                </div>
                <div className="btnsCarrusel">
                    <div style={{display:"flex"}}>
                        {
                            arrayImagenes.map((imagen) => (
                                <div
                                    key={imagen.StrArchivo}
                                    onClick={() => { setimagenCount(URLIMAGENESPRODUCTOS + imagen.StrArchivo) }}
                                    className={`imagenDiv ${URLIMAGENESPRODUCTOS + imagen.StrArchivo === imagenCount ? "selected" : "bg-slate-700 border-slate-300"} `}
                                >
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>
        </>
    )
}
