import React, { useEffect, useState } from 'react'
import { IEncargados, TEncargados } from '../Pedidos'

type TLabelSeguimientoValue = {
    text: string,
    valueChange: string,
    valueInput: string | number | null
    disabled?: boolean
    handleChangeValueSeguimiento: (value: string, valueChange: string) => void
    tipoSelect: number
    encargados: IEncargados
}

export const EncargadosSeguimiento: React.FC<TLabelSeguimientoValue> = ({ text, valueChange, valueInput, handleChangeValueSeguimiento, disabled = false, tipoSelect, encargados }) => {

    const [arrayEncargados, setarrayEncargados] = useState<TEncargados[]>([])

    useEffect(() => {
        switch (tipoSelect) {
            case 1:
                setarrayEncargados(encargados.alistamiento)
                break;
            case 2:
                setarrayEncargados(encargados.facturacion)
                break;
            case 3:
                setarrayEncargados(encargados.revision)
                break;
            default: break;
        }
    }, [encargados])


    return (
        <label>
            <p className='m-1'>{text}</p>
            {
                arrayEncargados && (
                    <select
                        disabled={disabled}
                        value={valueInput !== null ? valueInput : 1}
                        className='min-w-[250px] px-2 py-1 rounded outline-gray-400 border gray-300'
                        onChange={(e) => {
                            handleChangeValueSeguimiento(e.target.value, valueChange)
                        }}
                    >
                        <option value={0}>Sin encargado</option>
                        {
                            arrayEncargados.map((encargado) => (
                                <option value={encargado.id} key={encargado.id}>{encargado.nombre}</option>
                            ))
                        }
                    </select>
                )
            }

        </label>
    )
}
