import axios from '../../Utils/BaseUrlAxio'
import React, { useEffect, useState } from 'react'
import { BuscadorPedidos } from './BuscadorPedidos';
import { Loader } from "../../Components/LoadingPage/Loader";
import { TablePedidos } from '../../Components/TablePedidos/TablePedidos';
import './styles/styles.css'

export interface IDataPedidosProceso {
    intIdPedido: number,
    strIdPedidoVendedor: string,
    strNombVendedor: string,
    strNombCliente: string,
    dtFechaFinalizacion: string,
    dtFechaEnvio: string,
    intValorTotal: number
}

export const PedidosProceso: React.FC = () => {
    const [arrayDataPedidosProceso, setarrayDataPedidosProceso] = useState<IDataPedidosProceso[]>([])
    const [loadData, setloadData] = useState(true)

    useEffect(() => {
        ConsultarPedidosEnProceso()
    }, [])

    const ConsultarPedidosEnProceso = () => {
        axios.get(`/pedidos/proceso`)
            .then((response) => {
                if (response.data.success) {
                    setarrayDataPedidosProceso(response.data.data)
                    setloadData(false)
                }
            }).catch((err) => {
                alert("HA OCURRIDO UN ERROR COMUNICARSE CON SISTEMAS")
                console.error(err)
            })
    }
    return (
        <div>
            <BuscadorPedidos ConsultarPedidosEnProceso={ConsultarPedidosEnProceso} setdatos={setarrayDataPedidosProceso} setloadData={setloadData}/>

            {
                !loadData ? (
                    <>
                        <div className='TablePedidosContainer'>
                            <TablePedidos datos={arrayDataPedidosProceso}/>
                        </div>
                    </>
                )
                    : <Loader />
            }
        </div>
    )
}
