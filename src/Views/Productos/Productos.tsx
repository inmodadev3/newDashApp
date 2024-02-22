import React, { useContext, useEffect, useState } from "react"
import { MenuSelectedContext } from "../../context/UseContextProviders"
import { AppLayout } from "../../Components/AppLayout/AppLayout"
import { ProductosBuscador } from "./ProductosBuscador"
import { IArrayProductos } from "../../Utils/GlobalInterfaces"
import { ProductoCard } from "./ProductoCard"
import './Styles/stylesProductos.css'
import { Loader } from "../../Components/LoadingPage/Loader"
import { PermisosContext } from "../../context/permisosContext"
import { ModalsLayout } from "../../Components/Modals/ModalsLayout"
import axios from "../../Utils/BaseUrlAxio"
import { useAlert } from "../../hooks/useAlert"
import { AgregarAlerta } from "../../Utils/Helpers"

export const Productos = () => {

    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const { permisos } = useContext(PermisosContext)
    const { createToast, alerts } = useAlert()


    const [arrayProductos, setarrayProductos] = useState<IArrayProductos[]>([])
    const [loadProductos, setloadProductos] = useState<boolean>(false)
    const [ubicacion_editable, setubicacion_editable] = useState(false)
    const [viewModalEditarUbicacion, setviewModalEditarUbicacion] = useState(false)
    const [producto_editar, setproducto_editar] = useState<IArrayProductos>({} as IArrayProductos)
    const [nueva_ubicacion, setnueva_ubicacion] = useState('')


    useEffect(() => {
        setMenuSelected(9)
        setSubmenuSelected(0)
    }, [])

    useEffect(() => {
        if (permisos.length > 1) {
            let editable = permisos.find((permiso) => permiso.id_permiso == 13)

            if (editable !== null && editable !== undefined) {
                setubicacion_editable(true)
            }
        }
    }, [permisos])

    const HandleChangeUbicacion = (e: React.ChangeEvent<HTMLInputElement>) => {
        setnueva_ubicacion(e.target.value)
    }

    const Actualizar_ubicacion = async () => {
        try {
            let usuario = localStorage.getItem('dataUser')

            if (usuario) {
                await axios.post('/productos/ubicaciones', {
                    ubicacion: nueva_ubicacion,
                    referencia: producto_editar.referencia,
                    idUsuario: JSON.parse(usuario).idLogin,
                    ultima_ubicacion: producto_editar.Ubicacion
                })

                setarrayProductos((prevData) =>
                    prevData.map((producto) =>
                        producto.referencia == producto_editar.referencia ? { ...producto, Ubicacion: nueva_ubicacion } : producto
                    )
                );


                AgregarAlerta(createToast, "ubicacion cambiada con exito", 'success')
                setviewModalEditarUbicacion(false)
                setnueva_ubicacion('')
            }

        } catch (error) {
            AgregarAlerta(createToast, "Ha ocurrido un error al actualizar la ubicacion", 'danger')
        }
    }

    return (
        <AppLayout >
            <div className="px-4 arrayCardsBody">
                <ProductosBuscador setarrayProductos={setarrayProductos} setloadProductos={setloadProductos} />
                {
                    !loadProductos ? (
                        <div className={`${arrayProductos.length !== 1
                            ? "grid grid-cols-1 md:grid-cols-2 gap-5 px-6 py-12 place-items-center"
                            : "flex justify-center items-center py-4"}`}>
                            {
                                arrayProductos.length > 0 ? (
                                    arrayProductos.map((producto: IArrayProductos) => (
                                        <ProductoCard producto={producto} key={producto.referencia} editar_ubicacion={ubicacion_editable} setviewModalEditarUbicacion={setviewModalEditarUbicacion} setproducto_editar={setproducto_editar} />
                                    ))
                                ) : (
                                    <h1 className="col-span-2 text-2xl text-center">Digite una referencia valida</h1>
                                )
                            }
                        </div>
                    ) : (
                        <Loader />
                    )
                }

            </div>

            {
                viewModalEditarUbicacion && (
                    <ModalsLayout CloseEvent={setviewModalEditarUbicacion}>
                        <section className="z-20 w-full py-4 mx-4 space-y-4 bg-gray-100 md:w-1/3">
                            <label className="flex flex-col px-4">
                                <span>Referencia:</span>
                                <input
                                    type="text"
                                    aria-disabled={true}
                                    defaultValue={producto_editar.referencia}
                                    className="px-2 py-1 rounded "
                                />
                            </label>
                            <label className="flex flex-col px-4">
                                <span>Ubicacion actual:</span>
                                <input
                                    type="text"
                                    aria-disabled={true}
                                    defaultValue={producto_editar.Ubicacion}
                                    className="px-2 py-1 rounded "
                                />
                            </label>
                            <label className="flex flex-col px-4">
                                <span>Nueva ubicacion:</span>
                                <input
                                    type="text"
                                    value={nueva_ubicacion}
                                    onChange={HandleChangeUbicacion}
                                    autoFocus={true}
                                    className="px-2 py-1 rounded "
                                />
                            </label>

                            <div className="flex justify-center pb-2">
                                <button onClick={Actualizar_ubicacion} className="px-2 py-1 text-white bg-blue-600">Actualizar ubicacion</button>
                            </div>
                        </section>
                    </ModalsLayout>
                )
            }
            {alerts}
        </AppLayout>
    )
}
