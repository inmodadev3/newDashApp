import React from 'react'
import './stylesTablePedidos.css'
import { IDataPedidosNuevos } from '../../Views/Pedidos/PedidosNuevos'
import moment from 'moment'
import { FormateoNumberInt } from '../../Utils/Helpers'
import { AiOutlineCheck, AiOutlineEye } from 'react-icons/ai'

interface Idata {
    datos:IDataPedidosNuevos[]
}

export const TablePedidosNuevos:React.FC<Idata> = ({datos}) => {
  return (
    <table className="table">
        <thead>
            <tr>
                <th>Pedido</th>
                <th>Vendedor</th>
                <th>Cliente</th>
                <th>Finalizacion</th>
                <th>Envio</th>
                <th>Total</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {
                datos.map((pedido)=>(
                    <tr key={pedido.intIdPedido}>
                        <td style={{textDecoration:"underline"}}>{pedido.intIdPedido}</td>
                        <td>{pedido.strNombVendedor}</td>
                        <td>{pedido.strNombCliente}</td>
                        <td>{pedido.dtFechaFinalizacion}</td>
                        <td>{moment(pedido.dtFechaEnvio).format("DD-MM-yy")}</td>
                        <td>${ FormateoNumberInt((pedido.intValorTotal).toString())}</td>
                        <td>
                            <div className="ViewPedido"><a title="Ver" target="_blank" href={`/#/pedidos/pdf/${pedido.intIdPedido}`}><AiOutlineEye size={24} /></a></div>
                            <div className="ViewPedido"><span title="Finalizar"><AiOutlineCheck size={24}/></span></div>
                        </td>
                    </tr>
                ))
            }
        </tbody>
    </table>
  )
}
