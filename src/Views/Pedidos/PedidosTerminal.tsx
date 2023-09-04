import axios from '../../Utils/BaseUrlAxio'
import React, { useState, useEffect } from 'react'
import { Loader } from '../../Components/LoadingPage/Loader'
import { TablePedidosTerminal } from '../../Components/TablePedidos/TablePedidosTerminal'

export interface IDataPedidosTerminal {
    intIdPedido: number,
    strIdPedidoVendedor: string,
    strNombVendedor: string,
    strNombCliente: string,
    dtFechaEnvio: string,
    intValorTotal: number
}

export const PedidosTerminal: React.FC = () => {
    const [arrayDatosPedidosTerminal, setarrayDatosPedidosTerminal] = useState<IDataPedidosTerminal[]>([])
    const [loadData, setloadData] = useState(true)

    useEffect(() => {
        ConsultarPedidosEnTerminal()
    }, [])

    const ConsultarPedidosEnTerminal = () => {
        axios.get(`/pedidos/terminal`)
            .then((response) => {
                if (response.data.success) {
                    setarrayDatosPedidosTerminal(response.data.data)
                    setloadData(false)
                }
            }).catch((err) => {
                alert("OCURRIO UN ERROR COMUNICARSE CON SISTEMAS")
                console.error(err)
            })
    }

    return (
        <div>
            {!loadData ? (
                <div className='TablePedidosContainer'>
                    <TablePedidosTerminal datos={arrayDatosPedidosTerminal}/>
                </div>
            ) :
                <Loader />
            }
        </div>
    )
}
