import React, { useEffect, useContext, useState } from 'react'
import { AppLayout } from '../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../Utils/UseContextProviders'
import AxiosTienda from '../../Utils/AxiosTienda'
import { useAlert } from '../../hooks/useAlert'
import { AgregarAlerta } from '../../Utils/Helpers'
import moment from 'moment'
import { ModalsLayout } from '../../Components/Modals/ModalsLayout'
import { BsClipboardCheck } from 'react-icons/bs'

type TUsuarios_Registrados = {

    "intIdRegCliente": number,
    "strTipoDocCliente": string,
    "strIdCliente": string,
    "strNombCliente": string,
    "strDeptoCliente": string,
    "strCiudadCliente": string,
    "strCorreoCliente": string,
    "strTelefonoCliente": string,
    "strCelularCliente": string,
    "strLineasCliente": string,
    "strRutaDocumento": string,
    "dtFechaRegistro": string,
    "intEstado": number,
    "strDireccion": string,
    "strRedes": string

}


type TPropsDataFormUsuario = {
    text: string
    value: string,
}


const DataFormUsuario: React.FC<TPropsDataFormUsuario> = ({ text, value }) => {
    const { alerts, createToast } = useAlert()

    const copyClipBoard = (value: string) => {
        navigator.clipboard.writeText(value).then(() => {
            AgregarAlerta(createToast, `${text} copiado al portapales`, 'success')
        }).catch((err) => {
            AgregarAlerta(createToast, err, 'danger')
        })
    }

    return (
        <article>
            <span className='font-medium text-gray-600'>{text}</span>
            <label className='flex justify-between border-2 border-gray-400 px-4 py-2 rounded text-gray-800 font-thin'>
                <input
                    type='text'
                    value={value}
                    className='outline-none w-full'
                    disabled
                    id='name'
                />

                <button onClick={() => { copyClipBoard(value.toString()) }}><BsClipboardCheck size={20} /></button>

            </label>
            {alerts}
        </article>
    )
}

export const Registro_Usuarios: React.FC = () => {

    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const [usuarios_registrados, setusuarios_registrados] = useState<TUsuarios_Registrados[]>([])
    const { alerts, createToast } = useAlert()

    //FUNCION VER DATOS DE USUARIO
    const [usuario_seleccionado, setusuario_seleccionado] = useState({} as TUsuarios_Registrados)
    const [isVisibleModalUsuario, setisVisibleModalUsuario] = useState(false)

    //FUNCION  COPIAR


    useEffect(() => {
        setMenuSelected(11)
        setSubmenuSelected(0)
        window.document.title = "Panel - Usuarios_web"
        consultar_registros_recientes()
    }, [])

    const consultar_registros_recientes = async () => {
        try {
            const data = await AxiosTienda.get('/registro_usuarios')
            if (data.data.success) {
                setusuarios_registrados(data.data.data)
            } else {
                AgregarAlerta(createToast, "Ha ocurrido un error al consultar los usuarios", 'danger')
            }

        } catch (error) {
            console.log(error)
            AgregarAlerta(createToast, "Ha ocurrido un error", 'danger')

        }
    }

    const informacion_usuario = (usuario: TUsuarios_Registrados) => {
        setusuario_seleccionado(usuario)
        setisVisibleModalUsuario(true)
    }

    const Finalizar_registro = async (id: number) => {
        try {
            const data: any = await AxiosTienda.put(`/registro_usuarios/${id}`)
            if (data.data.success) {
                setusuarios_registrados((prevData) => {
                    return prevData.filter(item => item.intIdRegCliente !== id);
                })
                setisVisibleModalUsuario(false)
            } else {
                console.log(data)
                AgregarAlerta(createToast, "Ha ocurrido un error", 'warning')
            }

        } catch (error) {
            console.error(error)
            AgregarAlerta(createToast, "Ha ocurrido un error", 'danger')
        }
    }

    const Descargar_Ruth = async (ruta: string, nombre: string) => {
        try {
            const response = await AxiosTienda.get(`/registro_usuarios/descargar/${ruta}`, {
                responseType: 'blob', // Indicar que esperamos un archivo binario
            });

            // Crear una URL para el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Crear un enlace (a) para descargar el archivo
            const a = document.createElement('a');
            a.href = url;
            a.download = nombre;
            document.body.appendChild(a);

            // Simular un clic en el enlace para iniciar la descarga
            a.click();

            // Liberar la URL del objeto Blob
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AppLayout>
            <br />
            <h1 className='text-4xl py-2 text-center text-blue-900'>CLIENTES REGISTRADOS</h1>
            <br />
            <section className='TablePedidosContainer flex flex-col gap-y-6'>
                {
                    usuarios_registrados.map((item, index) => (
                        <div className='bg-gray-200 flex justify-between px-4 py-2 rounded' key={index}>
                            <div className='flex flex-col justify-center '>
                                <article>
                                    <p>Fecha: {moment(item.dtFechaRegistro).format('YY-MM-DD / hh:mm a')}</p>
                                    <p>{item.strNombCliente}</p>
                                </article>
                            </div>
                            <div className='flex flex-col py-4 gap-y-4'>
                                <button onClick={() => { Descargar_Ruth(item.strRutaDocumento, `${item.strNombCliente}-RUT.pdf`) }} className='bg-blue-600 text-white w-52 py-2 rounded hover:bg-blue-800'>Descargar RUT</button>
                                <button onClick={() => { informacion_usuario(item) }} className='bg-blue-600 text-white w-52 py-2 rounded hover:bg-blue-800'>Ver toda la informacion</button>

                            </div>

                        </div>
                    ))
                }
            </section>

            {
                isVisibleModalUsuario && (
                    <ModalsLayout CloseEvent={setisVisibleModalUsuario}>
                        <div className='w-1/2 h-5/6 bg-white z-10 grid grid-cols-1 px-12 py-8 gap-y-4 overflow-y-scroll rounded'>
                            <h3 className='text-center text-4xl text-blue-500'>Datos usuario</h3>
                            <DataFormUsuario
                                text='Identificacion'
                                value={`${usuario_seleccionado.strTipoDocCliente} ${usuario_seleccionado.strIdCliente}`}
                            />

                            <DataFormUsuario
                                text='Nombre'
                                value={`${usuario_seleccionado.strNombCliente}`}
                            />

                            <DataFormUsuario
                                text='Correo'
                                value={usuario_seleccionado.strCorreoCliente}
                            />

                            <DataFormUsuario
                                text='Celular'
                                value={usuario_seleccionado.strCelularCliente}
                            />

                            <DataFormUsuario
                                text='Deparamento'
                                value={usuario_seleccionado.strDeptoCliente}
                            />

                            <DataFormUsuario
                                text='Ciudad'
                                value={usuario_seleccionado.strCiudadCliente}
                            />

                            <DataFormUsuario
                                text='Direccion'
                                value={usuario_seleccionado.strDireccion}
                            />

                            <DataFormUsuario
                                text='Lineas que maneja'
                                value={usuario_seleccionado.strLineasCliente}
                            />

                            <DataFormUsuario
                                text='Redes'
                                value={usuario_seleccionado.strRedes}
                            />

                            <div className='flex w-full justify-around my-4'>
                                <button onClick={() => { Finalizar_registro(usuario_seleccionado.intIdRegCliente) }} className='border-2 bg-blue-500 text-white px-6 py-2 rounded border-blue-500 hover:bg-white hover:text-blue-500 transition-all'>Finalizar registro en Hgi</button>
                                <button onClick={() => { setisVisibleModalUsuario(false) }} className='border-2 bg-red-500 text-white px-6 py-2 rounded border-red-500 hover:bg-white hover:text-red-500 transition-all'>Cerrar</button>
                            </div>
                        </div>
                    </ModalsLayout>
                )
            }
            {alerts}
        </AppLayout>
    )
}
