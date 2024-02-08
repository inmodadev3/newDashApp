import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'
import { Switch } from '../../../Components/Inputs/Switch'
import { useAlert } from '../../../hooks/useAlert'
import { AgregarAlerta } from '../../../Utils/Helpers'
import axios from '../../../Utils/BaseUrlAxio'
import { useNavigate } from 'react-router-dom'
import ROUTES_PATHS from '../../../routers/Paths'


export type Permisos = {
    nombre_permiso: string,
    id_permiso: number,
}

type Permisos_usuario = {
    id_permiso: number,
}

type Empleados = {
    "idLogin": number,
    "strNombreEmpleado": string,
    "strUsuario": string,
    "strClave": string,
    "intIdCompania": number,
    "strIdVendedor": string,
    "strTelefonoVendedor": string
}

export const Permisos_Empleados: React.FC = () => {

    const { setSubmenuSelected, setMenuSelected } = useContext(MenuSelectedContext)
    const [permisos, setpermisos] = useState<Permisos[]>([] as Permisos[])
    const [permisos_usuario, setpermisos_usuario] = useState<Permisos_usuario[]>([] as Permisos_usuario[])
    const [empleados, setempleados] = useState<Empleados[]>([] as Empleados[])
    const [empleadoSelect, setempleadoSelect] = useState(1)
    const { alerts, createToast } = useAlert()
    const navigate = useNavigate()

    useEffect(() => {
        setSubmenuSelected(SubMenuSections.PERMISOS_EMPLEADO)
        setMenuSelected(MenuSections.ADMINISTRADOR)
        Consultar_permisos()
        Consultar_permisos_usuario()
        Consultar_Empleados()
    }, [])

    useEffect(() => {
        Consultar_permisos_usuario()
    }, [empleadoSelect])


    const handleSetPermission = async(id: number, checked: boolean) => {
        if (checked) {

            try {
                axios.delete(`/permisos/${empleadoSelect}/${id}`)
                setpermisos_usuario((prevData) => prevData.filter((permiso) => permiso.id_permiso !== id))
            } catch (error) {
                AgregarAlerta(createToast,`${error}`,'danger')
            }
            
        } else {

            try {
                await axios.post(`/permisos/usuario`,{
                    id_usuario:empleadoSelect, 
                    id_permiso:id
                })

                setpermisos_usuario((prevData) => {
                    return [...prevData, { 'id_permiso': id }]
                })
            } catch (error) {
                AgregarAlerta(createToast,`${error}`,'danger')
            }

            
        }
        /* setpermisos((prevPermisos) =>
            prevPermisos.map((permiso) =>
                permiso.nombre === nombrePermiso ? { ...permiso, estado } : permiso
            )
        ); */
    };

    const Consultar_permisos = async () => {
        try {
            const response_listaPermisos = await axios.get('/permisos')
            setpermisos(response_listaPermisos.data.permisos)
        } catch (error) {
            console.error(error)
            AgregarAlerta(createToast, 'Hubo un error al procesar la solicitud.', 'danger')
        }
    }

    const Consultar_permisos_usuario = async () => {
        try {
            const lista_permisos_usuario = await axios(`/permisos/${empleadoSelect}`)
            setpermisos_usuario(lista_permisos_usuario.data.permisos)
        } catch (error) {
            console.error(error)
            AgregarAlerta(createToast, 'Hubo un error al procesar la solicitud', 'danger')
        }
    }


    const Consultar_Empleados = async () => {
        try {
            const empleados = await axios.get('/empleados')
            setempleados(empleados.data.data)
        } catch (error) {
            console.error(error)
            AgregarAlerta(createToast, 'X', 'danger')
        }
    }

    const HandleChangeEmpleado = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setempleadoSelect(parseInt(e.target.value))
    }


    return (
        <AppLayout>
            <div className='my-12'>

                <div className='w-full relative my-4'>
                    <button onClick={()=>{navigate(ROUTES_PATHS.CREAR_PERMISOS_EMPLEADOS)}} className='absolute right-3 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900 transition-all'>Crear permiso</button>
                </div>
                <br/>
                <label className='flex flex-col font-medium text-slate-700 text-lg'>
                    Seleccione un usuario:
                    <select
                        className='border-2 outline-none border-slate-400 rounded px-4 py-2 text-sm uppercase my-2'
                        value={empleadoSelect}
                        onChange={HandleChangeEmpleado}
                    >
                        {
                            empleados.map((empleado) => (
                                <option key={empleado.idLogin} value={empleado.idLogin}>{empleado.strUsuario}</option>
                            ))
                        }
                    </select>
                </label>
                <article className='my-2'>
                    <p className=' font-bold text-md mx-4'>Permisos</p>
                </article>
                <hr className='border border-slate-600' />

                <form className='my-12 space-y-4 grid grid-cols-3'>
                    {
                        permisos.map((permiso, index) => (
                            <label className='flex items-center space-x-8' key={index}>
                                <Switch
                                    permiso={permiso}
                                    handleSetPermission={handleSetPermission}
                                    checked={permisos_usuario.length > 0 ? permisos_usuario.some((pu) => pu.id_permiso == permiso.id_permiso) : false}
                                />
                                <p className='text-lg font-bold text-slate-600'>{permiso.nombre_permiso}</p>
                            </label>
                        ))
                    }

                </form>
            </div>

            {alerts}
        </AppLayout>
    )
}
