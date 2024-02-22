import { SetStateAction, useState } from 'react'
import { IArrayProductos} from '../../Utils/GlobalInterfaces';
import axios from '../../Utils/BaseUrlAxio';
import './Styles/stylesProductosBuscador.css'
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';
import { AgregarAlerta } from '../../Utils/Helpers';

interface ISetProductos {
    setarrayProductos: React.Dispatch<React.SetStateAction<IArrayProductos[]>>;
    setloadProductos: React.Dispatch<React.SetStateAction<boolean>>
}

type TProductos = string

export const ProductosBuscador: React.FC<ISetProductos> = ({ setarrayProductos, setloadProductos }) => {
    const [productos, setproductos] = useState<TProductos>('')
    const [opcion, setopcion] = useState<SetStateAction<number | string>>(0)
    const { alerts, createToast } = useAlert()
    const navigate = useNavigate()

    const consultarProductos = () => {
        if (productos.toString().trim() !== '') {
            setloadProductos(true)
            setarrayProductos([])
            axios.get(`/productos/${productos}`/* , {
                headers: {
                    Authorization: `Bearer ${userInfo?.token}`
                }
            } */).then((response) => {
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
                axios.get(`/productos/nombre/${productos}`/* , {
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}`
                    }
                } */).then((response) => {
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
            <h1 className='py-4 text-4xl'>Buscador de productos</h1>
            <section className='flex flex-col w-full md:flex-row gap-x-12'>
                <div className='relative flex w-full h-12 px-4 py-1 bg-white border-2 rounded-xl md:w-1/2 border-sky-900'>
                    <input
                        className='w-full px-4 bg-transparent border-none outline-none '
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
                    <span className='absolute flex items-center justify-center w-10 h-10 rounded-full cursor-pointer right-2' onClick={consultarProductos}><AiOutlineSearch size={24} color={'black'} /> </span>
                </div>
                <div className='relative w-full h-12 px-4 my-1 bg-white border-2 rounded-xl md:w-1/2 border-sky-900'>
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
