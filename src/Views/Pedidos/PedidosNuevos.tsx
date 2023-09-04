import React, { useState, useEffect } from 'react'
import axios from '../../Utils/BaseUrlAxio'
import { Loader } from "../../Components/LoadingPage/Loader";
import { TablePedidosNuevos } from '../../Components/TablePedidos/TablePedidosNuevos';

export interface IDataPedidosNuevos {
    intIdPedido: number,
    strIdPedidoVendedor: string,
    strNombVendedor: string,
    strNombCliente: string,
    dtFechaFinalizacion: string,
    dtFechaEnvio: string,
    intValorTotal: number
}


export const PedidosNuevos: React.FC = () => {
    const [arrayData, setarrayData] = useState<IDataPedidosNuevos[]>([])
    const [loadData, setloadData] = useState(true)


    useEffect(() => {
        consultarPedidosNuevos()
    }, [])

    const consultarPedidosNuevos = () => {
        axios.get(`/pedidos/nuevos`)
            .then((response) => {
                if (response.data.success) {
                    setarrayData(response.data.data)
                    setloadData(false)
                }
            }).catch((err) => {
                alert("HA OCURRIDO UN ERROR COMUNICARSE CON SISTEMAS")
                console.error(err)
            })
    }

    return (
        <div>
            {!loadData ? (
                <div className='TablePedidosContainer'>
                    <TablePedidosNuevos datos={arrayData} />
                </div>
            )
                : <Loader />}
        </div>
    )
}
