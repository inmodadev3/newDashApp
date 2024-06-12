import React, { useState } from 'react'
import { ModalsLayout } from '../../../Components/Modals/ModalsLayout'
import { useAlert } from '../../../hooks/useAlert'
import { AgregarAlerta } from '../../../Utils/Helpers'

type Props = {
    setisViewModalSeleccionarReporte: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalSeleccionReporte: React.FC<Props> = ({ setisViewModalSeleccionarReporte }) => {

    const [opcionReporte, setopcionReporte] = useState(3)
    const [opcionFecha, setOpcionFecha] = useState('todos');

    /* CONTROL DE FECHAS */

    const [rangoInicial, setrangoInicial] = useState('')
    const [rangoFinal, setrangoFinal] = useState('')
    const [fechaMes, setfechaMes] = useState('')

    /* HOOKS */
    const { createToast, alerts } = useAlert()



    const cambiarOpcionReporte = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value)
        setopcionReporte(value)
    }

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setrangoInicial('')
        setrangoFinal('')
        setfechaMes('')
        setOpcionFecha(event.target.value);
    };

    const handleChangeFechas = (value: string, setFechaCambiar: React.Dispatch<React.SetStateAction<string>>) => {
        setFechaCambiar(value)
    }

    const generarReporte = () => {
        if (opcionReporte) {
            switch (opcionReporte) {
                case 1:
                    if (opcionFecha == 'rango' && (rangoInicial == '' || rangoFinal == '')) {
                        AgregarAlerta(createToast, 'Sin Fecha inicial o Fecha final', 'warning')
                        return;
                    }

                    if (opcionFecha == 'fecha' && fechaMes == '') {
                        AgregarAlerta(createToast, 'Sin Fecha', 'warning')
                        return;
                    }
                    const parametros = parametrosFecha()
                    window.open(`/#/pedidos/reporte/dropi?${parametros}`)
                    break;
                case 2:
                    window.open('/#/pedidos/reporte/dropi/pendientes')
                    break;
                case 3:
                    window.open('/#/pedidos/reporte/dropi/cartera')
                    break;
            }
        }
    }

    const parametrosFecha = () => {

        let parametros = '';

        switch (opcionFecha) {
            case 'todos':
                parametros = 'type=todos'
                break;
            case 'rango':
                parametros = `type=rango&fechaIni=${rangoInicial}&fechaFin=${rangoFinal}`
                break;
            case 'fecha':
                parametros = `type=unico&fecha=${fechaMes}`
                break;
        }

        return parametros;
    }




    return (
        <ModalsLayout CloseEvent={setisViewModalSeleccionarReporte}>
            <section className='z-10 px-8 py-4 bg-white border-4 border-gray-300 min-w-[600px]'>
                <p className='text-sm font-medium tracking-wide'>Seleccion de reporte de dropi</p>
                <hr className='border border-gray-400' />
                <br />
                <div className='flex mb-4 gap-x-4'>
                    <select
                        className='w-full py-1 text-black border border-gray-400 outline-none'
                        value={opcionReporte}
                        onChange={cambiarOpcionReporte}
                    >
                        <option value={3}>Cartera</option>
                        <option value={1}>Todos los pedidos</option>
                        <option value={2}>Pendientes</option>
                    </select>
                </div>

                {/* OPCION PARA FECHAS */}
                {
                    opcionReporte == 1 && (
                        <>
                            <fieldset className='flex my-2 gap-x-4'>
                                <div className='flex gap-x-2'>
                                    <input
                                        type="radio"
                                        value="todos"
                                        checked={opcionFecha === 'todos'}
                                        onChange={handleOptionChange}
                                        id='todos'
                                    />
                                    <label htmlFor='todos'>Todos</label>
                                </div>

                                <div className='flex gap-x-2'>
                                    <input
                                        type="radio"
                                        value="rango"
                                        checked={opcionFecha === 'rango'}
                                        onChange={handleOptionChange}
                                        id='rango'
                                    />
                                    <label htmlFor='rango'>Rango</label>
                                </div>

                                <div className='flex gap-x-2'>
                                    <input
                                        type="radio"
                                        value="fecha"
                                        checked={opcionFecha === 'fecha'}
                                        onChange={handleOptionChange}
                                        id='fecha'
                                    />
                                    <label htmlFor='fecha'>Mes</label>
                                </div>
                            </fieldset>

                            {
                                opcionFecha == 'rango' && (
                                    <div className='flex justify-around px-2 py-1 gap-x-2'>
                                        <section className='flex items-center gap-x-3'>
                                            <label htmlFor='fecha_ini'>
                                                <p>Desde</p>
                                            </label>

                                            <input
                                                type='month'
                                                id='fecha_ini'
                                                className='p-1 border-2 border-gray-300'
                                                value={rangoInicial}
                                                onChange={(e) => {
                                                    handleChangeFechas(e.target.value, setrangoInicial)
                                                }}
                                            />
                                        </section>

                                        <section className='flex items-center gap-x-3'>
                                            <label htmlFor='fecha_final'>
                                                <p>Hasta</p>
                                            </label>

                                            <input
                                                type='month'
                                                id='fecha_final'
                                                className='p-1 border-2 border-gray-300'
                                                min={rangoInicial !== '' ? rangoInicial : '2000-01'}
                                                value={rangoFinal}
                                                onChange={(e) => {
                                                    handleChangeFechas(e.target.value, setrangoFinal)
                                                }}
                                            />
                                        </section>
                                    </div>
                                )
                            }

                            {
                                opcionFecha == 'fecha' && (
                                    <div>
                                        <section>
                                            <input
                                                type='month'
                                                className='p-1 border-2 border-gray-300'
                                                value={fechaMes}
                                                onChange={(e) => {
                                                    handleChangeFechas(e.target.value, setfechaMes)
                                                }}
                                            />
                                        </section>
                                    </div>
                                )
                            }
                            <hr className='mt-4 border border-gray-400' />

                        </>
                    )
                }

                {/* BOTON PARA GENERAR REPORTE */}
                <div className='flex justify-end mt-4 mb-2'>
                    <button onClick={generarReporte} className='px-4 py-1 text-white bg-blue-500 rounded'>Generar</button>
                </div>
                {alerts}

            </section>

        </ModalsLayout>
    )
}
