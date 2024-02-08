import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { MenuSections } from '../../../Components/MenuLateral/MenuSections'
import axios from '../../../Utils/BaseUrlAxio'
import { useNavigate } from 'react-router-dom'
import ROUTES_PATHS from '../../../routers/Paths'
import { useAlert } from '../../../hooks/useAlert'
import { AgregarAlerta } from '../../../Utils/Helpers'

export const Crear_Permisos: React.FC = () => {
    const { setMenuSelected } = useContext(MenuSelectedContext)
    const [nombre_permiso, setnombre_permiso] = useState('')
    const navigate = useNavigate()
    const {alerts,createToast} = useAlert()

    useEffect(() => {
        setMenuSelected(MenuSections.ADMINISTRADOR)
    }, [])

    const handleChangeNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
        setnombre_permiso(e.target.value)
    }

    const Crear_permiso = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            if (nombre_permiso.length > 2) {
                axios.post('/permisos', {
                    nombre_permiso
                })
                navigate(ROUTES_PATHS.PERMISOS_EMPLEADOS)
            }else{
                AgregarAlerta(createToast,'El nombre debe tener mas 2 caracteres','warning')
            }

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <AppLayout>
            <div className='my-12 px-8 py-12 shadow-lg bg-whiterounded '>
                <form onSubmit={Crear_permiso}>

                    <label className='text-sm font-medium text-slate-700'>
                        Nombre del permiso
                        <input
                            type='text'
                            placeholder='Nombre del permiso'
                            className='w-full outline-blue-300 border-2 border-slate-600 px-4 py-2 rounded '
                            value={nombre_permiso}
                            onChange={handleChangeNombre}
                        />
                    </label>
                    <div className='relative mt-4 w-full h-auto flex justify-end'>
                        <button className=' bottom-0 right-3 bg-blue-700 text-white px-8 py-1 rounded'>Crear</button>
                    </div>
                </form>
            </div>

            {alerts}
        </AppLayout>
    )
}
