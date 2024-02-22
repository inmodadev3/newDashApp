import React from 'react'
import { IArrayProductos } from '../../../Utils/GlobalInterfaces'
import { Loader } from '../../../Components/LoadingPage/Loader'
import { ModalsLayout } from '../../../Components/Modals/ModalsLayout'
import { ProductosBuscador } from '../../Productos/ProductosBuscador'
import { ImagenNotFound, URLIMAGENESPRODUCTOS } from '../../../Utils/Helpers'

type IProps = {
    setisViewModalProductos: React.Dispatch<React.SetStateAction<boolean>>
    setisLoadingDataProductos: React.Dispatch<React.SetStateAction<boolean>>
    setarrayProductos: React.Dispatch<React.SetStateAction<IArrayProductos[]>>
    isLoadingDataProductos: boolean
    arrayProductos: IArrayProductos[]
    agregar_Producto: (strIdProducto: string) => void
}

export const ModalRevisionAgregarProducto: React.FC<IProps> = ({
    setisViewModalProductos,
    setisLoadingDataProductos,
    setarrayProductos,
    isLoadingDataProductos,
    arrayProductos,
    agregar_Producto
}) => {
    return (
        <ModalsLayout CloseEvent={setisViewModalProductos}>
            <div className='z-20 w-3/4 px-24 pb-24 bg-white border-spacing-1 h-5/6'>
                <ProductosBuscador setarrayProductos={setarrayProductos} setloadProductos={setisLoadingDataProductos} />

                {
                    !isLoadingDataProductos ? (
                        <div className={`flex justify-star items-center py-4 flex-col overflow-y-scroll h-5/6`}>
                            <table className='w-full'>
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Referencia</th>
                                        <th>Descripcion</th>
                                        <th>Inventario</th>
                                        <th>agregar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        arrayProductos.length > 0 ? (
                                            arrayProductos.map((producto: IArrayProductos) => (
                                                <tr key={producto.referencia} className='text-center'>
                                                    <td className='flex items-center justify-center'>
                                                        <img src={URLIMAGENESPRODUCTOS + producto.productoImg ? producto.productoImg !== null ? URLIMAGENESPRODUCTOS + producto.productoImg : ImagenNotFound : ImagenNotFound} alt="Imagen Producto" className="object-cover w-28 h-28" />
                                                    </td>
                                                    <td>{producto.referencia}</td>
                                                    <td>{producto.descripcion}</td>
                                                    <td>{producto.saldoInv}</td>
                                                    <td>
                                                        <button className='px-4 py-2 text-white bg-green-500 rounded' onClick={() => {
                                                            agregar_Producto(producto.referencia)
                                                        }}>✔</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="col-span-2 text-2xl text-center">
                                                <td>Digite una referencia valida</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>

                        </div>
                    ) : (
                        <Loader />
                    )
                }
            </div>
        </ModalsLayout>
    )
}
