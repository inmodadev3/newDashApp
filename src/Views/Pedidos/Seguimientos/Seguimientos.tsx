import React, { useEffect, useState } from 'react'
import { ModalsLayout } from '../../../Components/Modals/ModalsLayout'
import { IEncargados, TPedidosProps, TSeguimiento } from '../Pedidos'
import axios from '../../../Utils/BaseUrlAxio'
import { LabelSeguimiento } from './LabelSeguimiento'
import moment from 'moment'
import { EncargadosSeguimiento } from './EncargadosSeguimiento'
import { PropsSeguimientos } from './SeguimientosPanel'

interface ISeguimientosProps {
    setIsViewModalSeguimiento: React.Dispatch<React.SetStateAction<boolean>>
    intIdPedido: number
    setpedidos: React.Dispatch<React.SetStateAction<TPedidosProps[]>> | React.Dispatch<React.SetStateAction<PropsSeguimientos[]>>
    setpedidosCopy?: React.Dispatch<React.SetStateAction<TPedidosProps[]>> | React.Dispatch<React.SetStateAction<PropsSeguimientos[]>>
}


export const Seguimientos: React.FC<ISeguimientosProps> = ({ setIsViewModalSeguimiento, intIdPedido, setpedidos, setpedidosCopy }) => {

    const [encargados, setencargados] = useState<IEncargados>({} as IEncargados)
    const [seguimientoData, setSeguimientoData] = useState<TSeguimiento>({} as TSeguimiento)

    useEffect(() => {
        consultarEncargados()
        consultarInformacionSeguimientosBD(intIdPedido)
    }, [])


    const consultarEncargados = async () => {
        try {
            const encargados = await axios.get('/pedidos/encargados')
            setencargados(encargados.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleChangeValueSeguimiento = (value: any, valueChange: string) => {
        setSeguimientoData((prevData) => {
            return { ...prevData, [valueChange]: value }
        })
    }

    const consultarInformacionSeguimientosBD = async (idPedido: number) => {
        try {
            const response = await axios.get(`/pedidos/seguimiento?idPedido=${idPedido}`)
            const data: TSeguimiento = response.data.data
            let fecha;
            if (data.Fecha_Envio !== null) {
                fecha = new Date(data.Fecha_Envio);
            }

            if (fecha) {
                handleChangeValueSeguimiento(fecha, 'Fecha_Envio')
            }
            handleChangeValueSeguimiento(data.NroPedido, 'NroPedido')
            handleChangeValueSeguimiento(data.NroFactura, 'NroFactura')
            handleChangeValueSeguimiento(data.Cliente, 'Cliente')
            handleChangeValueSeguimiento(data.Vendedor, 'Vendedor')
            handleChangeValueSeguimiento(data.Ciudad, 'Ciudad')
            handleChangeValueSeguimiento(data.Pago, 'Pago')
            handleChangeValueSeguimiento(data.TipoVenta, 'TipoVenta')
            handleChangeValueSeguimiento(data.Encargado_Alistamiento1 == null ? 0 : data.Encargado_Alistamiento1, 'Encargado_Alistamiento1')
            handleChangeValueSeguimiento(data.Encargado_Alistamiento2 == null ? 0 : data.Encargado_Alistamiento2, 'Encargado_Alistamiento2')
            handleChangeValueSeguimiento(data.Encargado_Alistamiento3 == null ? 0 : data.Encargado_Alistamiento3, 'Encargado_Alistamiento3')
            handleChangeValueSeguimiento(data.Encargado_Revision, 'Encargado_Revision')
            handleChangeValueSeguimiento(data.Encargado_Facturacion, 'Encargado_Facturacion')
            handleChangeValueSeguimiento(data.TipoEnvio, 'TipoEnvio')
            handleChangeValueSeguimiento(data.NroGuia, 'NroGuia')
            handleChangeValueSeguimiento(data.Despacho, 'Despacho')
            handleChangeValueSeguimiento(data.ValorEnvio, 'ValorEnvio')
            handleChangeValueSeguimiento(data.NroCajas, 'NroCajas')
            handleChangeValueSeguimiento(data.Comentarios, 'Comentarios')
            handleChangeValueSeguimiento(data.Fecha_Facura, 'Fecha_Facura')
            handleChangeValueSeguimiento(data.Fecha_Pedido, 'Fecha_Pedido')
            handleChangeValueSeguimiento(data.isDropi, 'isDropi')
            handleChangeValueSeguimiento(data.Devolucion, 'Devolucion')
            handleChangeValueSeguimiento(data.Recaudo, 'Recaudo')
            handleChangeValueSeguimiento(data.Estado, 'Estado')
            handleChangeValueSeguimiento(data.Cartera, 'Cartera')

        } catch (error) {
            console.error(error)
        }
    }

    const Actualizar_Seguimiento = async () => {
        try {
            await axios.post('/pedidos/seguimiento', {
                seguimiento: seguimientoData
            })

            const newIsDropi = seguimientoData.isDropi ? 1 : 0
            const newPago = seguimientoData.Estado ? 1 : 0
            const newDevolucion = seguimientoData.Devolucion ? 1 : 0
            const estado = seguimientoData.Estado ? 1 : 0

            if (setpedidosCopy) {
                setpedidosCopy((prevData: TPedidosProps[] | PropsSeguimientos[]) =>
                    prevData.map((pedido: any) =>
                        pedido.intIdPedido === intIdPedido ? { ...pedido, isDropi: newIsDropi, pago: newPago, TipoVenta: seguimientoData.TipoVenta, Devolucion: newDevolucion, estado: estado } : pedido
                    )
                );
            }

            setpedidos((prevData: TPedidosProps[] | PropsSeguimientos[]) =>
                prevData.map((pedido: any) =>
                    pedido.intIdPedido === intIdPedido ? { ...pedido, isDropi: newIsDropi, pago: newPago, TipoVenta: seguimientoData.TipoVenta, Devolucion: newDevolucion, estado: estado } : pedido
                )
            );

            setIsViewModalSeguimiento(false)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <ModalsLayout CloseEvent={setIsViewModalSeguimiento}>
            <section className='z-30 w-auto px-8 py-4 bg-white rounded xl:min-w-[900px]'>
                <header className='flex justify-between'>
                    <article className='flex items-center justify-center'>
                        <p>Nro Pedido: <span>{seguimientoData.NroPedido}</span> </p>
                    </article>

                    <article className='flex justify-center items-center gap-x-4 [&>div]:flex [&>div]:flex-col [&>div]:justify-center'>
                        <label className={`flex justify-center items-center gap-x-2`}>
                            <p>Dropi</p>
                            <input
                                type='checkbox'
                                checked={seguimientoData.isDropi}
                                className={`px-2 py-1 rounded outline-gray-400 border gray-300 min-w-min`}
                                onChange={(e) => {
                                    handleChangeValueSeguimiento(e.target.checked, 'isDropi')
                                    if(e.target.checked){
                                        handleChangeValueSeguimiento("Dropi", 'TipoVenta')
                                    }
                                }}
                            />
                        </label>
                        {
                            seguimientoData.isDropi && (
                                <>
                                    <label className={`flex justify-center items-center`}>
                                        <p className='m-1'>Devolución</p>
                                        <input
                                            type={'checkbox'}
                                            checked={seguimientoData.Devolucion}
                                            className={`px-2 py-1 rounded outline-gray-400 border gray-300 min-w-min`}
                                            onChange={(e) => {
                                                handleChangeValueSeguimiento(e.target.checked, 'Devolucion')
                                            }}
                                        />
                                    </label>
                                    <label className={`flex justify-center items-center`}>
                                        <p className='m-1'>Cartera</p>
                                        <input
                                            type={'checkbox'}
                                            checked={seguimientoData.Cartera}
                                            className={`px-2 py-1 rounded outline-gray-400 border gray-300 min-w-min`}
                                            onChange={(e) => {
                                                handleChangeValueSeguimiento(e.target.checked, 'Cartera')
                                            }}
                                        />
                                    </label>
                                    <label className={`flex justify-center items-center gap-x-2`}>
                                        <p>Recaudo</p>
                                        <select
                                            onChange={(e) => {
                                                handleChangeValueSeguimiento(e.target.value, 'Recaudo')
                                            }}
                                            value={seguimientoData.Recaudo}
                                            className='border-2 rounded border-slate-300 '
                                        >
                                            <option value={""}></option>
                                            <option value={"Con Recaudo"}>Con Recaudo</option>
                                            <option value={"Sin Recaudo"}>Sin Recaudo</option>
                                        </select>
                                    </label>

                                </>
                            )
                        }

                    </article>
                </header>
                <hr className='my-2 border border-gray-300' />
                <div className='flex flex-col overflow-y-scroll gap-y-4 max-h-[340px]'>
                    <section>
                        <h3 className='my-2 font-semibold uppercase'>Información general</h3>
                        <article className='grid grid-cols-3 gap-x-6 gap-y-4'>
                            <LabelSeguimiento
                                text={"Cliente"}
                                valueChange={'Cliente'}
                                inputType={"text"}
                                valueInput={seguimientoData.Cliente}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            />

                            <LabelSeguimiento
                                text={"N° Factura / Pos"}
                                valueChange={'NroFactura'}
                                inputType={"number"}
                                valueInput={seguimientoData.NroFactura}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            />

                            <LabelSeguimiento
                                text={"Ciudad"}
                                valueChange={'Ciudad'}
                                inputType={"text"}
                                valueInput={seguimientoData.Ciudad}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            />

                            <LabelSeguimiento
                                text={"Vendedor"}
                                valueChange={'Vendedor'}
                                inputType={"text"}
                                valueInput={seguimientoData.Vendedor}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            />

                            <LabelSeguimiento
                                text={"Fecha Pedido"}
                                valueChange={'Fecha_Pedido'}
                                inputType={"text"}
                                valueInput={(seguimientoData.Fecha_Pedido !== null && seguimientoData.Fecha_Pedido !== undefined) ? (String(moment.utc(seguimientoData.Fecha_Pedido).format("MMM. DD, YYYY")).toString()) : ""}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                                disabled={true}
                            />

                            <LabelSeguimiento
                                text={"Fecha Factura"}
                                valueChange={'Fecha_Facura'}
                                inputType={"text"}
                                valueInput={(seguimientoData.Fecha_Facura !== null && seguimientoData.Fecha_Facura !== undefined) ? String(moment.utc(seguimientoData.Fecha_Facura).format("MMM. DD, YYYY")).toString() : ""}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                                disabled={true}
                            />

                            <LabelSeguimiento
                                text={"N° Guia"}
                                valueChange={'NroGuia'}
                                inputType={"text"}
                                valueInput={seguimientoData.NroGuia}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            />


                            <label>
                                <p>Tipo de venta</p>
                                <select
                                    onChange={(e) => {
                                        handleChangeValueSeguimiento(e.target.value, 'TipoVenta')
                                    }}
                                    value={seguimientoData.TipoVenta ? seguimientoData.TipoVenta : ""}
                                    //disabled={seguimientoData.isDropi ? true : false}
                                    className='min-w-[250px] px-2 py-1 rounded outline-gray-400 border gray-300'
                                >
                                    <option value={"Catalogo"}>Catalogo</option>
                                    <option value={"Sala"}>Sala</option>
                                    <option value={"Externo"}>Externo</option>
                                    <option value={"Redes"}>Redes</option>
                                    <option value={"Dropi"}>Dropi</option>
                                </select>
                            </label>



                            {/*  <LabelSeguimiento
                                text={"Tipo de venta"}
                                valueChange={'TipoVenta'}
                                inputType={"text"}
                                valueInput={seguimientoData.isDropi ? seguimientoData.TipoVenta = "Dropi" : seguimientoData.TipoVenta}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                                disabled={seguimientoData.isDropi ? true : false}
                            /> */}



                            <LabelSeguimiento
                                text={"Pago"}
                                valueChange={'Pago'}
                                inputType={"text"}
                                valueInput={seguimientoData.Pago}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            />

                            <label>
                                <p>Tipo de envio</p>
                                <select
                                    onChange={(e) => {
                                        handleChangeValueSeguimiento(e.target.value, 'TipoEnvio')
                                    }}
                                    value={seguimientoData.TipoEnvio ? seguimientoData.TipoEnvio : ""}
                                    className='min-w-[250px] px-2 py-1 rounded outline-gray-400 border gray-300'
                                >
                                    <option value={"Coordinadora"}>Coordinadora</option>
                                    <option value={"Transprensa"}>Transprensa</option>
                                    <option value={"Jhon"}>Jhon</option>
                                    <option value={"Sergio"}>Sergio</option>
                                    <option value={"Jesus"}>Jesus</option>
                                    <option value={"Recogió"}>Recogió</option>
                                    <option value={"Servientrega"}>Servientrega</option>
                                    <option value={"Veloenvios"}>Veloenvios</option>
                                    <option value={"Rapido Ochoa"}>Rapido Ochoa</option>
                                    <option value={"Estelar"}>Estelar</option>
                                    <option value={"Eduard"}>Eduard</option>
                                    <option value={"interrapidisimo"}>interrapidisimo</option>
                                    <option value={"Humberto"}>Humberto</option>
                                    <option value={"Orlando"}>Orlando</option>
                                    <option value={"Envientrega"}>Envientrega</option>
                                    <option value={"transegovia"}>transegovia</option>
                                    <option value={"Unicarga"}>Unicarga</option>
                                    <option value={"Oriente"}>Oriente</option>
                                    <option value={"Envia"}>Envia</option>
                                    <option value={"Transregional"}>Transregional</option>
                                    <option value={"Dropi"}>Dropi</option>
                                    <option value={"Jorge Guevara"}>Jorge Guevara</option>
                                    <option value={"Redetrans"}>Redetrans</option>
                                    <option value={"Coonorte"}>Coonorte</option>
                                    <option value={"Libertadores"}>Libertadores</option>
                                    <option value={"Brasilia"}>Brasilia</option>
                                </select>
                            </label>


                            {/*   <LabelSeguimiento
                                text={"Tipo de envio"}
                                valueChange={'TipoEnvio'}
                                inputType={"text"}
                                valueInput={seguimientoData.TipoEnvio}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            /> */}

                            <label>
                                <p>Contraentrega/Asumido</p>
                                <select
                                    onChange={(e) => {
                                        handleChangeValueSeguimiento(e.target.value, 'Despacho')
                                    }}
                                    value={seguimientoData.Despacho ? seguimientoData.Despacho : ""}
                                    className='min-w-[250px] px-2 py-1 rounded outline-gray-400 border gray-300'
                                >
                                    <option value={"Contraentrega"}>Contraentrega</option>
                                    <option value={"Asumido"}>Asumido</option>
                                </select>
                            </label>

                            {/*  <LabelSeguimiento
                                text={"Contraentrega/Asumido"}
                                valueChange={'Despacho'}
                                inputType={"text"}
                                valueInput={seguimientoData.Despacho}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            /> */}

                            <LabelSeguimiento
                                text={"Valor envio"}
                                valueChange={'ValorEnvio'}
                                inputType={"text"}
                                valueInput={seguimientoData.ValorEnvio}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            />

                            <LabelSeguimiento
                                text={"Nro cajas"}
                                valueChange={'NroCajas'}
                                inputType={"text"}
                                valueInput={seguimientoData.NroCajas}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                            />

                            <LabelSeguimiento
                                text={"Fecha Envio"}
                                valueChange={'Fecha_Envio'}
                                inputType={(seguimientoData.Fecha_Envio !== null && seguimientoData.Fecha_Envio !== undefined) ? "text" : "date"}
                                valueInput={(seguimientoData.Fecha_Envio !== null && seguimientoData.Fecha_Envio !== undefined) ? String(moment.utc(seguimientoData.Fecha_Envio).format("MMM. DD, YYYY")).toString() : ""}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                                disabled={false}
                            />


                        </article>
                    </section>
                    <section>
                        <h3 className='my-2 font-semibold uppercase'>Encargados</h3>
                        <article className='grid grid-cols-3 gap-x-6 gap-y-4'>
                            <EncargadosSeguimiento
                                text={"Encargado alistamiento 1"}
                                valueChange={'Encargado_Alistamiento1'}
                                valueInput={seguimientoData.Encargado_Alistamiento1}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                                tipoSelect={1}
                                encargados={encargados}
                            />

                            <EncargadosSeguimiento
                                text={"Encargado alistamiento 2"}
                                valueChange={'Encargado_Alistamiento2'}
                                valueInput={seguimientoData.Encargado_Alistamiento2}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                                tipoSelect={1}
                                encargados={encargados}
                            />

                            <EncargadosSeguimiento
                                text={"Encargado alistamiento 3"}
                                valueChange={'Encargado_Alistamiento3'}
                                valueInput={seguimientoData.Encargado_Alistamiento3}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                                tipoSelect={1}
                                encargados={encargados}
                            />

                            <EncargadosSeguimiento
                                text={"Encargado Revisión"}
                                valueChange={'Encargado_Revision'}
                                valueInput={seguimientoData.Encargado_Revision}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                                tipoSelect={3}
                                encargados={encargados}
                            />

                            <EncargadosSeguimiento
                                text={"Encargado Facturación"}
                                valueChange={'Encargado_Facturacion'}
                                valueInput={seguimientoData.Encargado_Facturacion}
                                handleChangeValueSeguimiento={handleChangeValueSeguimiento}
                                tipoSelect={2}
                                encargados={encargados}
                            />

                            <label className='col-span-3'>
                                <p className='m-1'>Comentarios</p>
                                <input
                                    type={"text"}
                                    value={seguimientoData.Comentarios !== null ? seguimientoData.Comentarios : ""}
                                    className='w-full px-2 py-1 border rounded outline-gray-400 gray-300'
                                    onChange={(e) => {
                                        handleChangeValueSeguimiento(e.target.value, "Comentarios")
                                    }}
                                />
                            </label>
                        </article>
                    </section>
                </div>
                <hr className='my-2 border border-gray-300' />
                <footer className='flex justify-between py-2'>
                    <button className='p-2 text-white bg-green-600 rounded' onClick={Actualizar_Seguimiento}>Actualizar</button>

                    <label className={`flex justify-center items-center`}>
                        <p className='m-1'>{seguimientoData.isDropi ? "Pagado" : "Despachado"}</p>
                        <input
                            type={'checkbox'}
                            checked={seguimientoData.Estado}
                            disabled={seguimientoData.Estado}
                            className={`px-2 py-1 rounded outline-gray-400 border gray-300 min-w-min`}
                            onChange={(e) => {
                                handleChangeValueSeguimiento(e.target.checked, 'Estado')
                            }}
                        />
                    </label>
                </footer>
            </section>
        </ModalsLayout>
    )
}
