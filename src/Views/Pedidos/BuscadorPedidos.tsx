import axios from '../../Utils/BaseUrlAxio'
import React, { useState } from 'react'
import { IDataPedidosProceso } from './PedidosProceso'

interface IBuscadorProps {
    ConsultarPedidosEnProceso: () => void
    setdatos: React.Dispatch<React.SetStateAction<IDataPedidosProceso[]>>
    setloadData: React.Dispatch<React.SetStateAction<boolean>>
}

export const BuscadorPedidos: React.FC<IBuscadorProps> = ({ ConsultarPedidosEnProceso, setdatos, setloadData }) => {

    const [nroPedido, setnroPedido] = useState<string>('')

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


    return (
        <div className='buscadorPedidosContainer'>
            <input
                type='number'
                placeholder='Buscar Nro de pedido'
                className='buscadorPedidos'
                value={nroPedido}
                onChange={(e) => { setnroPedido(e.target.value) }}
                onKeyUp={() => {
                    validarId()
                }}
                min={1}
            />
        </div>
    )
}
