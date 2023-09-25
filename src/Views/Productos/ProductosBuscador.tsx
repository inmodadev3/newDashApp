import { SetStateAction, useState } from 'react'
import { IArrayProductos, IDataUser } from '../../Utils/GlobalInterfaces';
import axios from '../../Utils/BaseUrlAxio';
import './Styles/stylesProductosBuscador.css'
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';
import { AgregarAlerta } from '../../Utils/Helpers';

interface ISetProductos {
    setarrayProductos: React.Dispatch<React.SetStateAction<IArrayProductos[]>>;
    userInfo: IDataUser | null
    setloadProductos: React.Dispatch<React.SetStateAction<boolean>>
}

type TProductos = string

export const ProductosBuscador: React.FC<ISetProductos> = ({ setarrayProductos, userInfo, setloadProductos }) => {
    const [productos, setproductos] = useState<TProductos>('')
    const [opcion, setopcion] = useState<SetStateAction<number | string>>(0)
    const { alerts, createToast } = useAlert()
    const navigate = useNavigate()

    const consultarProductos = () => {
        if (productos.toString().trim() !== '') {
            setloadProductos(true)
            setarrayProductos([])
            axios.get(`/productos/${productos}`, {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`
                }
            }).then((response) => {
                if (response.data.success) {
                    setarrayProductos(response.data.data)
                    setloadProductos(false)
                }
            }).catch((err) => {
                if (err.response.status === 403) {
                    navigate('/login')
                }
            })
        } else {
            AgregarAlerta(createToast, "Digite una descripcion de producto", "warning")
        }

    }

    const consultarProductosXNombre = () => {
        try {
            if (productos.toString().trim() !== '') {
                setloadProductos(true)
                setarrayProductos([])
                axios.get(`/productos/nombre/${productos}`, {
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`
                    }
                }).then((response) => {
                    if (response.data.success) {
                        setarrayProductos(response.data.data)
                        setloadProductos(false)
                    }
                }).catch((err) => {
                    if (err.response.status === 403) {
                        navigate('/login')
                    }
                })
            } else {
                AgregarAlerta(createToast, "Digite una referencia", "warning")
            }
        } catch (error) {
            console.error(error)
            AgregarAlerta(createToast,"Ha ocurrido un error inesperado","danger")
        }
    }

    const Buscar = () => {
        try {
            switch (opcion) {
                case '1':
                    consultarProductos()
                    break;

                case '2':
                    consultarProductosXNombre()
                    break;

                default:
                    consultarProductos()
                    break;
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <section className='flex flex-col items-center'>
            <h1 className='text-4xl py-4'>Buscador de productos</h1>
            <section className='flex flex-col md:flex-row w-full gap-x-12'>
                <div className='flex py-1 rounded-xl w-full md:w-1/2 border-2 border-sky-900 relative h-12 bg-white px-4'>
                    <input
                        className=' border-none outline-none bg-transparent px-4 w-full'
                        placeholder='Digite una referencia'
                        type='text'
                        value={productos}
                        onChange={(e) => { setproductos(e.target.value) }}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                Buscar()
                                /* consultarProductos() */
                            }
                        }}
                    />
                    <span className='absolute w-10 h-10 right-2 flex justify-center items-center rounded-full cursor-pointer' onClick={consultarProductos}><AiOutlineSearch size={24} color={'black'} /> </span>
                </div>
                <div className='my-1 rounded-xl w-full md:w-1/2 border-2 border-sky-900 relative h-12 bg-white px-4'>
                    <select
                        value={opcion.toString()}
                        onChange={(e) => { setopcion(e.target.value) }}
                        className='w-full h-full outline-none'
                    >
                        <option value={0} disabled>Selecionar una opcion de busqueda</option>
                        <option value={1}>Referencia</option>
                        <option value={2}>Descripción</option>
                    </select>
                </div>
            </section>
            {alerts}
        </section>
    )
}
