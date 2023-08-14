import React from "react"
import {IDataPedidosProceso} from '../../Views/Pedidos/PedidosProceso'
import './stylesTablePedidos.css'
import { FormateoNumberInt } from "../../Utils/Helpers"
import moment from "moment"
import { AiOutlineEye,AiOutlineCheck } from "react-icons/ai";

interface IDatatabla {
    datos: IDataPedidosProceso[]
}


export const TablePedidos:React.FC<IDatatabla> = ({datos}) => {

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
                        <td>{moment(pedido.dtFechaEnvio).format("DD-MM-yy HH:mm:ss")}</td>
                        <td>${pedido.intValorTotal?FormateoNumberInt((pedido.intValorTotal).toString()) : 0}</td>
                        <td>
                            <div className="ViewPedido"><a title="Ver" target="_blank" href={`/pedidos/pdf/${pedido.intIdPedido}` }><AiOutlineEye size={24} /></a></div>
                            <div className="ViewPedido"><span title="Finalizar"><AiOutlineCheck size={24}/></span></div>
                        </td>
                    </tr>
                ))
            }
        </tbody>
    </table>
  )
}
