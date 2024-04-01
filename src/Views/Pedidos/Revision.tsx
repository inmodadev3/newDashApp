import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../Components/AppLayout/AppLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { MenuSelectedContext } from '../../context/UseContextProviders'
import { MenuSections } from '../../Components/MenuLateral/MenuSections'
import axios from '../../Utils/BaseUrlAxio'
import { IDataProductosPdf, IHeaderPdf } from '../pdfs/pedidos/PedidosPDF'
import { LoaderInfo } from '../../Components/LoaderInfo/LoaderInfo'
import { MdDelete } from 'react-icons/md'
import { FormateoNumberInt } from '../../Utils/Helpers'
import { IArrayProductos } from '../../Utils/GlobalInterfaces'
import ROUTES_PATHS from '../../routers/Paths'
import './styles/styles.css'
import { AiFillEye } from 'react-icons/ai'
import { ModalRevisionAgregarProducto } from './Modales/ModalRevisionAgregarProducto'
import { ModalRevisionVerProducto } from './Modales/ModalRevisionVerProducto'
import { PermisosContext } from '../../context/permisosContext'

export const Revision: React.FC = () => {

    const { pedidoId } = useParams()
    const { setMenuSelected } = useContext(MenuSelectedContext)
    const { permisos } = useContext(PermisosContext)
    const [headerPedido, setheaderPedido] = useState<IHeaderPdf>({} as IHeaderPdf)
    const [dataPedido, setdataPedido] = useState<IDataProductosPdf[]>([] as IDataProductosPdf[])
    const [loadingData, setloadingData] = useState<boolean>(true)
    const [dataPedidoCopy, setdataPedidoCopy] = useState<IDataProductosPdf[]>([] as IDataProductosPdf[])
    const [isViewModalProductos, setisViewModalProductos] = useState(false)
    const [arrayProductos, setarrayProductos] = useState<IArrayProductos[]>([] as IArrayProductos[])
    const [isLoadingDataProductos, setisLoadingDataProductos] = useState<boolean>(false)
    const [isViewModalInfoProducto, setisViewModalInfoProducto] = useState(false)
    const [referenciaInfoProducto, setreferenciaInfoProducto] = useState('')
    const navigate = useNavigate()

    useEffect(() => {

        GetInfoPedido()
        setMenuSelected(MenuSections.PEDIDOS)
    }, [])

    const compararNombresAZ = (a: IDataProductosPdf, b: IDataProductosPdf) => {
        return a.strIdProducto.localeCompare(b.strIdProducto)
    }

    const GetInfoPedido = () => {
        axios.get(`/pedidos/detalle_pedido/${pedidoId}`)
            .then((response) => {
                if (response.data.success) {
                    response.data.data.sort(compararNombresAZ)
                    setheaderPedido(response.data.header)
                    setdataPedido(response.data.data)
                    setdataPedidoCopy(response.data.data)
                } else {
                    console.error(response)
                }
            }).catch((err) => {
                alert("HA OCURRIDO UN ERROR AL CARGAR EL PEDIDO")
                console.error(err)
            }).finally(() => {
                setloadingData(false)
            })
    }

    const handleChangeBuscador = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        if (value.trim() !== "") {
            const coincidencias = dataPedidoCopy.filter((producto) => producto.strIdProducto.toLowerCase().includes(value.toLowerCase()))
            setdataPedido(coincidencias)
        } else {
            setdataPedido(dataPedidoCopy)
        }
    }

    const handleChangeCantidad = (e: React.ChangeEvent<HTMLInputElement>, intIdPedDetalle: number) => {
        const value = e.target.value

        setdataPedido((prevData) =>
            prevData.map((pedido) =>
                pedido.intIdPedDetalle === intIdPedDetalle ? { ...pedido, valor_original: pedido.intCantidad, intCantidad: parseInt(value) } : pedido
            )
        )

        setdataPedidoCopy((prevData) =>
            prevData.map((pedido) =>
                pedido.intIdPedDetalle === intIdPedDetalle ? { ...pedido, valor_original: pedido.intCantidad, intCantidad: parseInt(value) } : pedido
            )
        )

    }

    const blurCantidad = async (e: React.ChangeEvent<HTMLInputElement>, intIdPedDetalle: number) => {
        const value = e.target.value

        if (value.toString().trim() == "" || parseInt(value) < 0) {
            setdataPedido((prevData) =>
                prevData.map((pedido) =>
                    pedido.intIdPedDetalle === intIdPedDetalle ? { ...pedido, valor_original: pedido.intCantidad, intCantidad: pedido.valor_original ? pedido.valor_original : 1 } : pedido
                )
            )
        } else {

        }

        const precio = calcular_total()

        await axios.put('/pedidos/producto', {
            id: intIdPedDetalle,
            valor: parseInt(value),
            valor_total: precio,
            tipo: 2,
            pedidoId: headerPedido.intIdpedido
        })
    }

    const actualizar_estado_producto = async (intIdPedDetalle: number, valor: number, tipo: number, dataProductos = dataPedido) => {

        let total = 0;

        dataProductos.map((producto) => {
            let cantidad = (!Number.isNaN(producto.intCantidad) || producto.intCantidad !== 0) ? producto.intCantidad : 1
            total += (cantidad) * (producto.intPrecio)
        })

        setheaderPedido((prevValue) => {
            return { ...prevValue, intValorTotal: total }
        })

        await axios.put('/pedidos/producto', {
            id: intIdPedDetalle,
            valor,
            valor_total: total,
            tipo: tipo,
            pedidoId: headerPedido.intIdpedido
        })
    }

    const eliminar_producto = async (intIdPedDetalle: number) => {
        const dataProductos = dataPedido.filter((producto) => producto.intIdPedDetalle !== intIdPedDetalle)
        setdataPedido(dataProductos)

        await actualizar_estado_producto(intIdPedDetalle, -1, 1, dataProductos)

    }

    const calcular_total = () => {
        let total = 0;

        dataPedidoCopy.map((producto) => {
            let cantidad = (!Number.isNaN(producto.intCantidad)) ? producto.intCantidad : 1
            total += (cantidad) * (producto.intPrecio)
        })

        setheaderPedido((prevValue) => {
            return { ...prevValue, intValorTotal: total }
        })

        return total;
    }

    const Abrir_Modal_Productos = () => {
        setisViewModalProductos(!isViewModalProductos)
    }

    const agregar_Producto = async (strIdProducto: String) => {
        try {
            const idCliente = headerPedido.strIdCliente
            const idPedido = headerPedido.intIdpedido

            const data = await axios.post('/pedidos/producto', {
                idCliente,
                "idProducto": strIdProducto,
                "idPedido": idPedido
            })

            const response = data.data.response

            const newData = [...dataPedido, {
                "intIdPedDetalle": response.nuevoIdDetalle,
                "intIdPedido": response.idPedido,
                "strIdProducto": response.referencia,
                "strDescripcion": response.descripcion,
                "intCantidad": response.intCantidad,
                "strUnidadMedida": response.strUnidad,
                "strObservacion": "",
                "intPrecio": response.precio,
                "intPrecioProducto": response.precio,
                "strColor": "",
                "strTalla": "",
                "intEstado": 1,
                "ubicaciones": "",
                "precio_cambio": false
            }]

            setdataPedido(newData)
            setdataPedidoCopy(newData)
            setisViewModalProductos(false)
            setarrayProductos([])

            await calcular_total()

        } catch (error) {
            console.error(error)
        }
    }

    const finalizar_revision = async () => {
        await axios.put('/pedidos/actualizar_estado', {
            id: headerPedido.intIdpedido,
            estado: 4
        })

        navigate(ROUTES_PATHS.PEDIDOS)
    }

    const check_producto = async (e: React.ChangeEvent<HTMLInputElement>, strIdProducto: string, intIdPedDetalle: number) => {
        const checkValue = e.target.checked

        if (checkValue) {

            await actualizar_estado_producto(intIdPedDetalle, 2, 1)

            setdataPedido((PrevValue) =>
                PrevValue.map((producto) => (
                    producto.strIdProducto == strIdProducto ? { ...producto, intEstado: 2 } : producto
                ))
            )

            setdataPedidoCopy((PrevValue) =>
                PrevValue.map((producto) => (
                    producto.strIdProducto == strIdProducto ? { ...producto, intEstado: 2 } : producto
                ))
            )

        } else {

            await actualizar_estado_producto(intIdPedDetalle, 1, 1)

            setdataPedido((PrevValue) =>
                PrevValue.map((producto) => (
                    producto.strIdProducto == strIdProducto ? { ...producto, intEstado: 1 } : producto
                ))
            )

            setdataPedidoCopy((PrevValue) =>
                PrevValue.map((producto) => (
                    producto.strIdProducto == strIdProducto ? { ...producto, intEstado: 1 } : producto
                ))
            )
        }
    }

    return (
        <AppLayout>
            <div className='w-full h-screen py-3'>
                <section className='flex justify-between px-12 text-lg font-semibold tracking-wider'>
                    <article>
                        <h3>IN MODA FANTASY S.A.S</h3>
                    </article>
                    <article>
                        <h5>Pedido: <span className='text-base font-medium'># {pedidoId}</span></h5>
                    </article>
                </section>
                <br />
                <hr className='border border-black' />
                <br />
                <section>
                    {
                        !loadingData ? (
                            dataPedidoCopy.length > 0 ? (
                                <>
                                    <div>
                                        <section className='flex flex-col items-center justify-between gap-x-8 lg:flex-row'>
                                            <label className='w-3/5 '>
                                                <input
                                                    type='text'
                                                    className='w-full px-4 py-2 my-2 border-2 border-gray-400 rounded outline-none focus:border-sky-500'
                                                    placeholder='Digita una referencia para buscar'
                                                    onChange={handleChangeBuscador}
                                                />
                                            </label>
                                            <article className='flex justify-center w-2/5'>
                                                <button onClick={Abrir_Modal_Productos} className='px-8 py-2 text-white duration-300 bg-blue-500 rounded hover:bg-blue-700'>Agregar producto</button>
                                            </article>
                                        </section>
                                    </div>
                                    <br />
                                    <article>
                                        <p className='font-bold'>Total: <span className='font-medium'>${FormateoNumberInt(headerPedido.intValorTotal.toString())}</span></p>
                                    </article>
                                    <br />
                                    <div className='w-full'>
                                        <table className='w-full border-2 bg-gray-50 border-black/30'>
                                            <thead className="border-b-2 border-b-black/30 text-center [&>th]:py-4">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Revisado</th>
                                                    <th>Ver</th>
                                                    <th>Referecia</th>
                                                    <th>Descripcion</th>
                                                    <th>Cantidad</th>
                                                    <th>Precio</th>
                                                    <th className='pr-4'>Unidad de medida</th>
                                                    <th>Color</th>
                                                    <th>Observacion</th>
                                                    <th>Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    dataPedido.map((producto, key:number) => (
                                                        <tr
                                                            key={producto.strIdProducto}
                                                            className={`border-b-2 border-b-black/20 text-center [&>td]:py-4 [&>td]:text-sm group relative ${producto.intEstado == 2 && "table_checked"}`}
                                                        >
                                                            <td className='px-2'>{key + 1}</td>
                                                            <td className=''>
                                                                <input
                                                                    type="checkbox"
                                                                    className='w-6 h-6 rounded'
                                                                    checked={producto.intEstado == 2 ? true : false}
                                                                    onChange={(e) => {
                                                                        check_producto(e, producto.strIdProducto, producto.intIdPedDetalle)
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className='flex items-center justify-center mx-2'>
                                                                <span
                                                                    onClick={() => {
                                                                        setisViewModalInfoProducto(!isViewModalInfoProducto)
                                                                        setreferenciaInfoProducto(producto.strIdProducto)
                                                                    }}
                                                                    className='cursor-pointer'>
                                                                    <AiFillEye size={20} />
                                                                </span>
                                                            </td>
                                                            <td>{producto.strIdProducto}</td>
                                                            <td>{producto.strDescripcion}</td>
                                                            <td>
                                                                <input
                                                                    type='number'
                                                                    className='w-20 px-4 py-2 text-center border-2 border-gray-500 rounded outline-none'
                                                                    value={producto.intCantidad}
                                                                    min={1}
                                                                    onChange={(e) => { handleChangeCantidad(e, producto.intIdPedDetalle) }}
                                                                    onBlur={(e) => {
                                                                        blurCantidad(e, producto.intIdPedDetalle)
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className='px-12'>${FormateoNumberInt(producto.intPrecio.toString())}</td>
                                                            <td>{producto.strUnidadMedida}</td>
                                                            <td>{producto.strColor}</td>
                                                            <td>{producto.strObservacion}</td>
                                                            <td className='flex justify-center'>
                                                                <span onClick={() => { eliminar_producto(producto.intIdPedDetalle) }} className='cursor-pointer'><MdDelete size={26} color={'red'} /></span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <br />
                                    {
                                        (permisos.find((item) => item.id_permiso == 3) || permisos.find((item) => item.id_permiso == 14)) && (
                                            <div className='flex justify-end py-4'>
                                                <button onClick={finalizar_revision} className='px-4 py-2 text-white duration-300 bg-green-500 rounded hover:bg-green-700'>Finalizar revision</button>
                                            </div>
                                        )
                                    }
                                </>
                            ) : (
                                <div className='flex flex-col items-center w-full mt-32 space-y-2'>
                                    <span className='font-medium text-gray-600 text-md'>Sin productos encontrados...</span>
                                </div>
                            )
                        ) : (
                            <div className='flex flex-col items-center w-full mt-32 space-y-2'>
                                <LoaderInfo />
                                <span className='font-medium text-gray-600 text-md'>Cargando Productos...</span>
                            </div>
                        )
                    }
                </section>
            </div >

            {
                isViewModalProductos && (
                    <ModalRevisionAgregarProducto
                        setisViewModalProductos={setisViewModalProductos}
                        setisLoadingDataProductos={setisLoadingDataProductos}
                        setarrayProductos={setarrayProductos}
                        isLoadingDataProductos={isLoadingDataProductos}
                        arrayProductos={arrayProductos}
                        agregar_Producto={agregar_Producto}
                    />
                )
            }

            {
                isViewModalInfoProducto && (
                    <ModalRevisionVerProducto
                        setisViewModalInfoProducto={setisViewModalInfoProducto}
                        referenciaInfoProducto={referenciaInfoProducto}
                    />
                )
            }
        </AppLayout >
    )
}
