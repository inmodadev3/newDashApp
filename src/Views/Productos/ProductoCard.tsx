import { IArrayProductos } from "../../Utils/GlobalInterfaces"
import { FormateoNumberInt, ImagenNotFound, URLIMAGENESPRODUCTOS } from "../../Utils/Helpers"
import { useState } from "react"
import './Styles/stylesProductoCard.css'
import axios from "../../Utils/BaseUrlAxio"

interface IArrayImagenes {
    StrArchivo: string
}

export const ProductoCard: React.FC<{ producto: IArrayProductos }> = ({ producto }) => {

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

    return (
        <>
            <div className="flex flex-col lg:flex-row w-full max-w-2xl h-full justify-between border-2 border-gray-300 rounded">
                <figure
                    className="bg-white w-full lg:w-1/2 cursor-pointer flex border-gray-400 border-b-2 lg:border-r-2 lg:border-b-0 h-full"
                    onClick={() => {
                        setViewImage(true)
                        setimagenCount(producto.productoImg !== null ? URLIMAGENESPRODUCTOS + producto.productoImg : ImagenNotFound)
                        ConsultarImagenesProducto()
                    }}>
                    <img src={URLIMAGENESPRODUCTOS + producto.productoImg ? producto.productoImg !== null ? URLIMAGENESPRODUCTOS + producto.productoImg : ImagenNotFound : ImagenNotFound} alt="Imagen Producto" className="w-full h-full object-contain" />
                </figure>
                <div className="px-5 bg-gray-300/10 w-full lg:w-1/2 flex flex-col gap-y-2">
                    <span className=" text-lg underline text-sky-950 font-bold">{producto.descripcion}</span>
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
                        <span className={"font-bold text-sky-950 text-lg"}>{producto.saldoInv !== null ? "Inventario : ": "Sin inventario"} </span>
                        <span>{producto.saldoInv !== null ? parseInt(producto.saldoInv).toFixed(0) : ""}</span>
                    </div>
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
