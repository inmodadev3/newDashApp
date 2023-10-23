import React, { useState } from 'react'
import { useAlert } from '../../../hooks/useAlert'
import { AgregarAlerta } from '../../../Utils/Helpers'
import AxiosTienda from '../../../Utils/AxiosTienda';
import { Loader } from '../../../Components/LoadingPage/Loader';
import { ModalsLayout } from '../../../Components/Modals/ModalsLayout';
import { AiFillCheckCircle } from 'react-icons/ai';

type PropsInputForm = {
    placeholder: string;
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>;
    type?: string;
    event?: () => any
}

const InputForm: React.FC<PropsInputForm> = ({ placeholder, value, setValue, type = "text", event }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className=' outline-none border-2 border-gray-300 rounded w-full my-2 py-1 px-2 lg:w-1/2'
            value={value}
            onChange={(e) => { setValue(e.target.value) }}
            onKeyDown={event}
        />
    )
}

export const Registro: React.FC = () => {

    window.document.title = 'Registro Mayoristas'
    const [nombre, setnombre] = useState('')
    const [tipoIdentificacion, settipoIdentificacion] = useState('0')
    const [identificacion, setidentificacion] = useState('')
    const [correo, setcorreo] = useState('')
    const [celular, setcelular] = useState('')
    const [direccion, setdireccion] = useState('')
    const [departamento, setdepartamento] = useState('')
    const [ciudad, setciudad] = useState('')
    const [linea, setlinea] = useState('')
    const [redes, setredes] = useState('')
    const [documento, setdocumento] = useState<File | null>(null)

    const { alerts, createToast } = useAlert()
    const [validandoDatos, setvalidandoDatos] = useState(false)
    const [visibleModalDatos, setvisibleModalDatos] = useState(false)


    const validar_identificacion = () => {
        if (/[^0-9]/.test(identificacion)) {
            setidentificacion(identificacion.replace(/[^0-9]/g, ''))
        }

        if (/[^0-9]/.test(celular)) {
            setcelular(celular.replace(/[^0-9]/g, ''))
        }
    }

    const enviar_datos = async () => {
        setvalidandoDatos(true)
        try {
            if (
                nombre !== '' &&
                identificacion !== '' &&
                correo !== '' &&
                celular !== '' &&
                direccion !== '' &&
                ciudad !== '' &&
                linea !== '' &&
                documento !== null
            ) {
                const datos_registro = new FormData()
                datos_registro.append('nombre', nombre);
                datos_registro.append('identificacion', identificacion)
                datos_registro.append('tipoDoc', tipoIdentificacion.toString() == "0" ? "CC" : "NIT")
                datos_registro.append("correo", correo)
                datos_registro.append("celular", celular)
                datos_registro.append("telefono", celular)
                datos_registro.append("direccion", direccion)
                datos_registro.append("ciudad", ciudad)
                datos_registro.append("departamento", departamento)
                datos_registro.append("linea", linea)
                datos_registro.append("redes", redes)
                datos_registro.append("file", documento)

                const data = await AxiosTienda.post('/registro_usuarios', datos_registro)
                if (data.data.success) {
                    setvisibleModalDatos(true)
                } else {
                    if (data.data.error) {
                        AgregarAlerta(createToast, data.data.error, 'warning')
                    } else {
                        AgregarAlerta(createToast, "Ha ocurrido un error intentelo mas tarde", 'danger')
                    }
                }
            } else {
                AgregarAlerta(createToast, 'Por favor, completa todos los campos.', "warning")
            }
        } catch (error: any) {
            AgregarAlerta(createToast, error.response.data.error, 'danger')
        } finally {
            setvalidandoDatos(false)
        }
    }

    const cerrar_Modal_validacion = () => {
        setvisibleModalDatos(false)
        setnombre('')
        settipoIdentificacion('0')
        setidentificacion('')
        setcorreo('')
        setcelular('')
        setdireccion('')
        setdepartamento('')
        setciudad('')
        setlinea('')
        setredes('')
        setdocumento(null)
    }

    return (
        <div className='w-screen h-screen flex'>
            <section className='hidden lg:inline-block w-1/5 h-screen bg-blue-500'></section>
            <section className='w-full min-h-screen xl:w-4-5 flex justify-center items-center '>
                <div className='w-full h-full lg:w-2/3 lg:h-5/6 lg:shadow shadow-gray-500 rounded lg:border-2 border-spacing-1 border-gray'>
                    <article className='block text-center py-4'>
                        <h1 className='font-extrabold text-blue-500 text-5xl pl-1 pr-1 pt-1 pb-1'>Registrate</h1>
                        <p className=' font-thin text-gray-500'>Para esta sección primero queremos conocerte, nuestros mayoristas son parte importante de Inmoda</p>
                    </article>
                    <div className='mx-12 mt-8'>
                        <div className='flex gap-x-12 flex-col lg:flex-row '>
                            <InputForm
                                placeholder='Nombre Completo'
                                value={nombre}
                                setValue={setnombre}
                            />

                            <div className=' outline-none border-2 border-gray-300 rounded lg:w-1/2 py-1 px-2 flex'>
                                <select value={tipoIdentificacion} onChange={(e) => { settipoIdentificacion(e.target.value) }} className='border-r-2 h-full'>
                                    <option value={0}>CC</option>
                                    <option value={1}>NIT</option>
                                </select>
                                <input
                                    type={"number"}
                                    placeholder={"Digite su documento"}
                                    className=' outline-none px-2 bg-transparent'
                                    value={identificacion}
                                    onChange={(e) => { setidentificacion(e.target.value) }}
                                />
                            </div>


                        </div>

                        <div className='flex gap-x-12 flex-col lg:flex-row '>
                            <InputForm
                                placeholder='Correo'
                                value={correo}
                                setValue={setcorreo}
                                type='email'
                            />

                            <InputForm
                                placeholder='Celular'
                                value={celular}
                                setValue={setcelular}
                                event={validar_identificacion}
                            />

                        </div>

                        <div className='flex gap-x-12 flex-col lg:flex-row '>
                            <InputForm
                                placeholder='Departamento'
                                value={departamento}
                                setValue={setdepartamento}
                            />

                            <InputForm
                                placeholder='Ciudad'
                                value={ciudad}
                                setValue={setciudad}
                            />

                        </div>

                        <div className='flex gap-x-12 flex-col lg:flex-row '>
                            <InputForm
                                placeholder='Dirección'
                                value={direccion}
                                setValue={setdireccion}
                            />

                            <InputForm
                                placeholder='Linea que maneja (ejemplo: Maquillaje)'
                                value={linea}
                                setValue={setlinea}
                            />

                        </div>

                        <div className='flex gap-x-12 flex-col lg:flex-row '>

                            <InputForm
                                placeholder='Redes sociales (opcional)'
                                value={redes}
                                setValue={setredes}
                            />

                        </div>

                        <div className='mt-8'>
                            <p className='text-sm my-2 font-thin text-gray-500 underline'>{documento !== null ? documento.name : `Adjuntar RUT o fotografia de la Cedula por ambos lados (En formato PDF)`}</p>
                            <div className="mt-2 relative rounded-md shadow-sm">
                                <label htmlFor='file' className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 px-4 cursor-pointer">
                                    Subir Archivo
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    className="sr-only"
                                    onChange={(e) => {
                                        const file = e.target.files && e.target.files[0];
                                        if (file) {
                                            setdocumento(file);
                                        }

                                    }}
                                />
                            </div>
                            <br />
                            <span className='text-sm w-40 py-2 font-thin text-gray-500'></span>
                        </div>
                        <article className='flex justify-start lg:justify-end py-2'>
                            <button onClick={enviar_datos} className='mt-4 bg-blue-500 text-white px-2 py-1 rounded'>Enviar datos</button>
                        </article>
                        <br />
                    </div>
                </div>
            </section>
            {alerts}
            {
                validandoDatos && (
                    <Loader />
                )
            }
            {
                visibleModalDatos && (
                    <ModalsLayout CloseEvent={setvisibleModalDatos}>
                        <div className=' w-full sm:w-3/5 lg:w-2/4 h-3/5 bg-white z-10'>
                            <article className='flex justify-center h-1/2 items-center'>
                                <span><AiFillCheckCircle size={140} color={'blue'} /></span>
                            </article>
                            <article className='flex items-center flex-col px-2 text-center lg:text-base'>
                                <p className='font-medium text-base text-gray-500'>Estamos verificando sus datos</p>
                                <p className='font-medium text-lg text-gray-500'>Uno de nuestros asesores se estara comunicando muy pronto con usted .</p>
                            </article>
                            <div className='flex mt-12 justify-center'>
                                <button onClick={cerrar_Modal_validacion} className='bg-blue-500 text-white w-32 py-2 rounded hover:bg-blue-700 transition-colors'>Aceptar</button>
                            </div>
                        </div>
                    </ModalsLayout>
                )
            }
        </div>
    )
}
