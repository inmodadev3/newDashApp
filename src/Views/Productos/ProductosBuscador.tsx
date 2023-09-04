import { useState } from 'react'
import { IArrayProductos, IDataUser } from '../../Utils/GlobalInterfaces';
import axios from '../../Utils/BaseUrlAxio';
import './Styles/stylesProductosBuscador.css'
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

interface ISetProductos {
    setarrayProductos: React.Dispatch<React.SetStateAction<IArrayProductos[]>>;
    userInfo: IDataUser | null
    setloadProductos: React.Dispatch<React.SetStateAction<boolean>>
}

type TProductos = string

export const ProductosBuscador: React.FC<ISetProductos> = ({ setarrayProductos, userInfo , setloadProductos }) => {
    const [productos, setproductos] = useState<TProductos>('')
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
        }

    }


    return (
        <section className='flex flex-col items-center'>
            <h1 className='text-4xl py-4'>Buscador de productos</h1>
            <div className='flex py-1 rounded-3xl w-1/2 border-2 border-sky-900 relative h-12 bg-white'>
                <input
                    className=' border-none outline-none bg-transparent px-4 w-full'
                    placeholder='Digite una referencia'
                    type='text'
                    value={productos}
                    onChange={(e) => { setproductos(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                            consultarProductos()
                        }
                    }}
                />
                <span className='absolute w-10 h-10 right-2 flex justify-center items-center rounded-full cursor-pointer' onClick={consultarProductos}><AiOutlineSearch size={24} color={'black'}/> </span>
            </div>
        </section>
    )
}
