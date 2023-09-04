import React from 'react'
import './stylesTablePedidos.css'
import moment from 'moment'
import { FormateoNumberInt } from '../../Utils/Helpers'
import { AiOutlineEye } from 'react-icons/ai'
import { IDataPedidosTerminal } from '../../Views/Pedidos/PedidosTerminal'

interface ITablePedidosTerminalProps {
    datos:IDataPedidosTerminal[]
}

export const TablePedidosTerminal:React.FC<ITablePedidosTerminalProps> = ({datos}) => {
  return (
    <table className="table">
        <thead>
            <tr>
                <th>Pedido</th>
                <th>Vendedor</th>
                <th>Cliente</th>
                <th>Fecha Creacion</th>
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
                        <td>{moment(pedido.dtFechaEnvio).format("DD-MM-yy")}</td>
                        <td>${ FormateoNumberInt((pedido.intValorTotal).toString())}</td>
                        <td>
                            <div className="ViewPedido" style={{justifyContent :"start"}}><a href={`http://192.168.1.127:5173/pedidos/proceso/${pedido.intIdPedido}`} target='_blank' title="Ver"><AiOutlineEye size={26} /></a></div>
                        </td>
                    </tr>
                ))
            }
        </tbody>
    </table>
  )
}
