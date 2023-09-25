import axios from '../../Utils/BaseUrlAxio'
import React, { useState, useRef } from 'react'

interface IBuscadorProps {
    ConsultarPedidosEnProceso: () => void
    setdatos: React.Dispatch<React.SetStateAction<TPedidosProps[]>>
    setloadData: React.Dispatch<React.SetStateAction<boolean>>
}

type TPedidosProps = {
    intIdPedido: number,
    strIdPedidoVendedor: number,
    strNombVendedor: string,
    strNombCliente: string,
    dtFechaFinalizacion: string,
    dtFechaEnvio: string,
    intValorTotal: number,
    intEstado: number
}

export const BuscadorPedidos: React.FC<IBuscadorProps> = ({ ConsultarPedidosEnProceso, setdatos, setloadData }) => {

    const [nroPedido, setnroPedido] = useState<string>('')
    const typingTime = useRef<any>(null)

    const validarId = () => {
        if (nroPedido.toString().trim() !== "") {
            ConsultarPedidosXId()
        } else {
            ConsultarPedidosEnProceso()
        }
    }

    const ConsultarPedidosXId = () => {
        setloadData(true)
        axios.get(`/pedidos/id/${nroPedido}`)
            .then((response) => {
                if (response.data.success) {
                    setdatos(response.data.data)
                    setloadData(false)
                }
            }).catch((err) => {
                console.error(err)
            })
    }

    const handleInputChange = () => {
        if (typingTime.current) {
            clearTimeout(typingTime.current);
        }

        typingTime.current = setTimeout(() => {
            validarId()
        }, 1000);
    }

    return (
        <div className='buscadorPedidosContainer'>
            <input
                type='number'
                placeholder='Buscar Nro de pedido'
                className="w-1/2 border-2 border-gray-400 outline-none mx-4 my-2 py-2 px-4 rounded focus:border-sky-500"
                value={nroPedido}
                onChange={(e)=>{
                    setnroPedido(e.target.value)
                }}
                onKeyUp={() => {
                    handleInputChange()
                }}
                min={1}
                ref={typingTime}
            />
        </div>
    )
}
