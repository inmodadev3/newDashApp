import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'
import axios from '../../../Utils/BaseUrlAxio'
import { useNavigate } from 'react-router-dom'
import ROUTES_PATHS from '../../../routers/Paths'

export const AgregarEncargado: React.FC = () => {

    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const [nombre, setnombre] = useState('')
    const [rol, setrol] = useState(1)
    const navigate = useNavigate()

    useEffect(() => {
        setMenuSelected(MenuSections.PEDIDOS)
        setSubmenuSelected(SubMenuSections.ENCARGADOS)
    }, [])


    const crear_encargado = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await axios.post('/pedidos/encargado',{
                nombre,
                rol
            })
            
            navigate(ROUTES_PATHS.ENCARGADOS)
        } catch (error) {
            console.error('error')
        }

    }

    const handleChangeNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
        setnombre(e.target.value)
    }

    const handleChangeRol = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setrol(parseInt(e.target.value))
    }

    return (
        <AppLayout>
            <div className='my-12 px-8 py-12 shadow-lg bg-whiterounded '>
                <form onSubmit={crear_encargado} className='grid grid-cols-2'>

                    <label className='text-sm font-medium text-slate-700 w-1/2'>
                        Nombre del Encargado
                        <input
                            type='text'
                            placeholder='Nombre del Encargado'
                            className='w-full outline-blue-300 border-2 border-slate-600 px-4 py-2 rounded '
                            value={nombre}
                            onChange={handleChangeNombre}
                        />
                    </label>
                    <label className='text-sm font-medium text-slate-700 w-1/2'>
                        Tipo encargado
                        <select
                            value={rol}
                            onChange={handleChangeRol}
                            className='w-full outline-blue-300 border-2 border-slate-600 px-4 py-2 rounded '
                        >
                            <option value={1}>Alistamiento</option>
                            <option value={2}>Facturación</option>
                            <option value={3}>Revision</option>
                        </select>
                    </label>

                    <div className='relative mt-4 h-auto flex'>
                        <button className=' bottom-0 right-3 bg-blue-700 text-white px-8 py-1 rounded'>Crear</button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
