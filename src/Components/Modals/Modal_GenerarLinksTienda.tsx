import React, { useEffect, useState } from 'react'
import { ModalsLayout } from './ModalsLayout'
import { BsClipboardCheck } from 'react-icons/bs'
import { useAlert } from '../../hooks/useAlert'
import { AgregarAlerta } from '../../Utils/Helpers'

interface PropsModalGenerarLinks {
    CloseEvent: React.Dispatch<React.SetStateAction<boolean>>
    vendedor: IPropsVendedor
}

export interface IPropsVendedor {
    "idLogin": number,
    "strNombreEmpleado": string,
    "strUsuario": string,
    "strClave": string,
    "intIdCompania": number,
    "strIdVendedor": string,
    "strTelefonoVendedor": string,
    "token": string
}

export const Modal_GenerarLinksTienda: React.FC<PropsModalGenerarLinks> = ({ CloseEvent, vendedor }) => {
    const [tipoTienda, settipoTienda] = useState(1)
    const [precio, setprecio] = useState(1)
    const [LinkTienda, setLinkTienda] = useState('')
    const { alerts, createToast } = useAlert()
    const urlTienda = 'https://tienda.inmodafantasy.com.co/#/'

    useEffect(() => {
        setLinkTienda("")
    }, [tipoTienda, precio])

    useEffect(() => {
        let seller: IPropsVendedor;

        if (vendedor) {
            seller = vendedor
            if (tipoTienda == 1) {
                setLinkTienda(`${urlTienda}login/?seller=${seller.idLogin}`)
            }
        }
    }, [])


    const handleChangeTipoTienda = (e: React.ChangeEvent<HTMLSelectElement>) => {
        settipoTienda(parseInt(e.target.value))
    }

    const handleChangePrecio = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setprecio(parseInt(e.target.value))
    }

    const copyClipBoard = () => {
        navigator.clipboard.writeText(LinkTienda).then(() => {
            AgregarAlerta(createToast, `link copiado al portapales`, 'success')
        }).catch((err) => {
            AgregarAlerta(createToast, err, 'danger')
        })
    }

    const generarLink = () => {
        let link = "";
        let seller: IPropsVendedor;

        if (vendedor) {
            seller = vendedor
            if (tipoTienda == 0) {
                link = `${urlTienda}?pr=${precio}&seller=${seller.idLogin}`
            } else if (tipoTienda == 1) {
                link = `${urlTienda}login/?seller=${seller.idLogin}`
            }

            setLinkTienda(link)
        } else {
            AgregarAlerta(createToast, "Ha ocurrido un error identificando al vendedor", "danger")
        }
    }

    return (
        <ModalsLayout CloseEvent={CloseEvent}>
            <section className='z-20 bg-white px-12 py-8 space-y-4 md:w-1/3 w-full'>
                <label className='flex flex-col'>
                    <p className='text-sm text-slate-600'>Seleccione tipo de tienda</p>
                    <select
                        className='outline-none border border-slate-400 px-4 py-2'
                        value={tipoTienda}
                        onChange={handleChangeTipoTienda}
                    >
                        <option value={0}>Por precio</option>
                        <option value={1}>Por usuario</option>
                    </select>
                </label>

                {
                    tipoTienda == 0 && (
                        <label className='flex flex-col'>
                            <p className='text-sm text-slate-600'>Seleccione el precio de la tienda</p>
                            <select
                                className='outline-none border border-slate-400 px-4 py-2'
                                value={precio}
                                onChange={handleChangePrecio}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </select>
                        </label>
                    )
                }

                <button
                    className='bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700'
                    onClick={generarLink}
                >Generar link</button>

                <label className='flex border border-slate-800 rounded-md p-2'>
                    <input
                        type='text'
                        disabled
                        className='outline-none w-full text-slate-500 text-sm font-medium'
                        value={LinkTienda}
                    />

                    <span onClick={copyClipBoard} className='cursor-pointer'><BsClipboardCheck size={20} /></span>
                </label>
                {alerts}

            </section>
        </ModalsLayout>
    )
}
