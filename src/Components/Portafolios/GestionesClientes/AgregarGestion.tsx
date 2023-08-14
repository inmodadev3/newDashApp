import axios from '../../../Utils/BaseUrlAxio'
import React, { useState } from 'react'
import { useAlert } from '../../../hooks/useAlert'
import { AgregarAlerta } from '../../../Utils/Helpers'


type PropsAddGestion = {
    cedula: string
    idLogin: number
    ConsultarGestionesClientes: () => void
}

export const AgregarGestion: React.FC<PropsAddGestion> = ({ cedula, idLogin, ConsultarGestionesClientes }) => {

    const [gestionValue, setgestionValue] = useState('')
    const [tipoGestion, settipoGestion] = useState("0")
    const {alerts,createToast} = useAlert()

    const crearNuevaGestion = () => {
        if (gestionValue.toString().trim() !== "") {
            axios.post(`/portafolios/gestiones/agregar`, {
                "clienteId": cedula,
                "intTipoGestion": parseInt(tipoGestion),
                "intIdLogin": idLogin,
                "strObservacion": gestionValue
            }).then((response) => {
                //response.data.message
                AgregarAlerta(createToast,response.data.message,'success')
                ConsultarGestionesClientes()
                setgestionValue("")
            }).catch((err) => {
                console.error(err)
            })
        } else {
            AgregarAlerta(createToast,"Se necesita una gestion para agregar",'warning')
        }

    }

    return (
        <>
            <div className='AgregarGestionesContainer'>
                <div className='inputGestion'>
                    <input
                        type='text'
                        placeholder='Agregar Gestion'
                        value={gestionValue}
                        onChange={(e) => { setgestionValue(e.target.value) }}
                    />
                </div>
                <div className='fixed_gestion'>
                    <select onChange={(e) => { settipoGestion(e.target.value) }}>
                        <option value={0}>Llamada</option>
                        <option value={1}>Envio de Fotos</option>
                        <option value={2}>Envio de Portafolio</option>
                        <option value={3}>Venta en sala</option>
                        <option value={4}>Venta en Dash</option>
                        <option value={5}>Visita a cliente</option>
                        <option value={6}>Pos venta</option>
                        <option value={7}>Deshabilitar</option>
                        <option value={8}>Varios</option>
                    </select>
                </div>
                <div className='fixed_gestion'>
                    <button onClick={crearNuevaGestion}>Agregar</button>
                </div>
            </div>
            {alerts}
        </>

    )
}
