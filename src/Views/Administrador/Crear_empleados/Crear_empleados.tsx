import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'
import { ModalsLayout } from '../../../Components/Modals/ModalsLayout'
import axios from '../../../Utils/BaseUrlAxio'
import { AgregarAlerta } from '../../../Utils/Helpers'
import { useAlert } from '../../../hooks/useAlert'
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'

interface IObjectEmpleados {
    "idLogin": number,
    "strNombreEmpleado": string,
    "strUsuario": string,
    "strClave": string,
    "intIdCompania": number,
    "strIdVendedor": string,
    "strTelefonoVendedor": string
}

export const Crear_empleados: React.FC = () => {

    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const [isViewListaEmpleados, setisViewListaEmpleados] = useState(false)
    const [actualizable, setactualizable] = useState(false)
    const { alerts, createToast } = useAlert()

    const [nombre, setnombre] = useState('')
    const [id, setid] = useState('')
    const [user, setuser] = useState('')
    const [password, setpassword] = useState('')
    const [celular, setcelular] = useState('')
    const [empleado_buscar, setempleado_buscar] = useState('')
    const [idEditar, setidEditar] = useState(0)

    const [empleados, setempleados] = useState<IObjectEmpleados[]>([])
    const [arrEmpleadosCopy, setarrEmpleadosCopy] = useState<IObjectEmpleados[]>([])

    useEffect(() => {
        setMenuSelected(MenuSections.ADMINISTRADOR)
        setSubmenuSelected(SubMenuSections.CREAR_EMPLEADO)
    }, [])

    useEffect(() => {
        if (isViewListaEmpleados) {
            consultar_Empleados()
        }
    }, [isViewListaEmpleados])

    const handleChangeVisibleListaEmpleados = () => {
        setisViewListaEmpleados(true)
    }

    const handleChangeNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
        setnombre(e.target.value)
    }

    const handleChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setid(e.target.value)
    }

    const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        setuser(e.target.value)
    }

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setpassword(e.target.value)
    }

    const handleChangeCelular = (e: React.ChangeEvent<HTMLInputElement>) => {
        setcelular(e.target.value)
    }

    const handleChangeBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setempleado_buscar(e.target.value)
    }

    const crear_empleado = async () => {
        if (user.trim() !== "" && nombre.trim() !== "" && id.trim() !== "" && password.trim() !== "") {
            if (actualizable) {
                try {
                    await axios.put('/empleados/actualizar', {
                        nombre,
                        cedula: id,
                        usuario: user,
                        passw: password,
                        celular,
                        login: idEditar
                    })

                    AgregarAlerta(createToast, `Acutalizado con exito el empleado con id ${idEditar}`, "success")
                    limpiarDatos()

                } catch (error) {
                    AgregarAlerta(createToast, `${error}`, "danger")
                }
            } else {
                try {
                    const empleados = await axios.post('/empleados/crear', {
                        nombre,
                        id,
                        user,
                        passw: password,
                        celular
                    })

                    AgregarAlerta(createToast, `${empleados.data.message}`, "success")
                    limpiarDatos()

                } catch (error) {
                    AgregarAlerta(createToast, `${error}`, "danger")
                }
            }

        } else {
            AgregarAlerta(createToast, `Se deben llenar los campos requeridos`, "warning")
        }
    }

    const consultar_Empleados = async () => {
        try {
            const empleados = await axios.get('/empleados')
            setempleados(empleados.data.data)
            setarrEmpleadosCopy(empleados.data.data)
        } catch (error) {
            AgregarAlerta(createToast, `${error}`, "danger")
        }
    }

    useEffect(() => {
        buscar_Empleados()
    }, [empleado_buscar])

    const buscar_Empleados = () => {
        let data: IObjectEmpleados[];
        if (empleado_buscar.trim() !== "") {
            let buscar: IObjectEmpleados[];

            if (/^\d/.test(empleado_buscar)) {
                buscar = arrEmpleadosCopy.filter(item => {
                    const strIdVendedor = item.strIdVendedor || '';
                    return strIdVendedor.includes(empleado_buscar);
                });
            } else {
                buscar = arrEmpleadosCopy.filter(item => (item.strUsuario.toLowerCase()).includes(empleado_buscar.toLowerCase()))
            }
            data = buscar
        } else {
            data = arrEmpleadosCopy
        }

        setempleados(data)
    }

    const event_editar = (empleado: IObjectEmpleados) => {
        setnombre(empleado.strNombreEmpleado)
        setid(empleado.strIdVendedor)
        setuser(empleado.strUsuario)
        setpassword(empleado.strClave)
        setcelular(empleado.strTelefonoVendedor)
        setidEditar(empleado.idLogin)
        setactualizable(true)
        setisViewListaEmpleados(false)
    }

    const limpiarDatos = () => {
        setnombre("")
        setid("")
        setuser("")
        setpassword("")
        setcelular("")
        setactualizable(false)
        setempleado_buscar("")
    }

    const eliminar_empleado = async (id: number) => {
        try {
            axios.delete(`/empleados/eliminar/${id}`)
            AgregarAlerta(createToast, `El empleado con id ${id} se ha eliminado con exito`, "success")
            setempleados((prevData)=>{
                return prevData.filter(item=>item.idLogin !== id)
            })
            setarrEmpleadosCopy((prevData)=>{
                return prevData.filter(item=>item.idLogin !== id)
            })
            limpiarDatos()
        } catch (error) {
            AgregarAlerta(createToast, "Ha ocurrido un error al eliminar el empleado", 'danger')
        }
    }

    return (
        <AppLayout>
            <div className='mt-4'>
                <button className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700' onClick={handleChangeVisibleListaEmpleados}>Lista de empleados</button>
            </div>
            <section className='px-12 mt-4'>
                <label htmlFor='nombre_empleado'>
                    <p className='px-1 py-2 font-medium'>Nombre Empleado</p>
                    <input
                        type='text'
                        id='nombre_empleado'
                        className='w-full px-4 py-2 border-2 rounded-lg outline-none border-slate-300'
                        placeholder='Ejemplo: Sara Perez'
                        value={nombre}
                        onChange={handleChangeNombre}
                        required
                    />
                </label>

                <label htmlFor='id_empleado'>
                    <p className='px-1 py-2 font-medium'>Identificación</p>
                    <input
                        type='text'
                        id='id_empleado'
                        className='w-full px-4 py-2 border-2 rounded-lg outline-none border-slate-300'
                        placeholder='Ejemplo: 1234567890'
                        value={id}
                        onChange={handleChangeId}
                        required
                    />
                </label>

                <label htmlFor='usuario_empleado'>
                    <p className='px-1 py-2'>Usuario</p>
                    <input
                        type='text'
                        id='usuario_empleado'
                        className='w-full px-4 py-2 border-2 rounded-lg outline-none border-slate-300'
                        placeholder='Ejemplo: Sara_Perez'
                        value={user}
                        onChange={handleChangeUser}
                        required
                    />
                </label>

                <label htmlFor='password_empleado'>
                    <p className='px-1 py-2'>Contraseña</p>
                    <input
                        type='text'
                        id='password_empleado'
                        className='w-full px-4 py-2 border-2 rounded-lg outline-none border-slate-300'
                        placeholder='Ejemplo: SP7890*'
                        value={password}
                        onChange={handleChangePassword}
                        required
                    />
                </label>

                <label htmlFor='celular_empleado'>
                    <p className='px-1 py-2'>Celular </p>
                    <input
                        type='text'
                        id='celular_empleado'
                        className='w-full px-4 py-2 border-2 rounded-lg outline-none border-slate-300'
                        placeholder='Ejemplo: 1234567 (Opcional)'
                        value={celular}
                        onChange={handleChangeCelular}
                    />
                </label>

                <div className='relative mt-8'>
                    <button onClick={crear_empleado} className='absolute right-0 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700'>{actualizable ? "Actualizar Empleado" : "Crear Empleado"}</button>
                </div>
            </section>

            {
                isViewListaEmpleados && (
                    <ModalsLayout CloseEvent={setisViewListaEmpleados}>
                        <section className='z-20 px-20 py-12 bg-white min-h-[400px] w-5/6'>
                            <h1>Lista de empleados</h1>
                            <label>
                                <input
                                    type='text'
                                    className='w-full px-4 py-2 border-2 rounded-lg outline-none border-slate-300'
                                    placeholder='Buscar empleado'
                                    value={empleado_buscar}
                                    onChange={handleChangeBuscar}
                                />
                            </label>

                            <div className='mt-12 max-h-[450px] overflow-y-scroll'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='[&>th]:px-4 py-2 bg-gray-300'>
                                            <th>Usuario</th>
                                            <th>Clave</th>
                                            <th>Empleado</th>
                                            <th>Identificación</th>
                                            <th>Celular</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            empleados.map((empleado) => (
                                                <tr key={empleado.idLogin} className='[&>td]:text-center [&>td]:px-4 [&>td]:py-4 text-sm font-medium'>
                                                    <td>{empleado.strUsuario}</td>
                                                    <td>{empleado.strClave}</td>
                                                    <td>{empleado.strNombreEmpleado}</td>
                                                    <td>{empleado.strIdVendedor}</td>
                                                    <td>{empleado.strTelefonoVendedor !== '"' && empleado.strTelefonoVendedor}</td>
                                                    <td>
                                                        <div className='flex gap-x-4'>
                                                            <span onClick={() => { event_editar(empleado) }} className={`cursor-pointer hover:text-blue-500 transition-colors`}><FaRegEdit size={23} /></span>
                                                            <span onClick={() => { eliminar_empleado(empleado.idLogin) }} className={`cursor-pointer hover:text-red-500 transition-colors`}><FaRegTrashAlt size={23} /></span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </section>
                    </ModalsLayout>
                )
            }
            {alerts}
        </AppLayout>
    )
}
