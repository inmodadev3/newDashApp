import React, { useContext, useState, useEffect } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { SubMenuSections } from '../../../Components/MenuLateral/MenuSections'
import axios from '../../../Utils/BaseUrlAxio'
import { Excel_Compras } from '../../../Utils/excelTemplates/ExcelFormats'

type TRaggis = {
    intIdDocumentoReferencia: number,
    strRaggi: string,
    strImportacion:string
}

export const Descargar_liquidadas: React.FC = () => {

    const { setSubmenuSelected } = useContext(MenuSelectedContext)

    //Estados
    const [raggis, setraggis] = useState<TRaggis[]>([] as TRaggis[])
    const [raggi_selected, setraggi_selected] = useState('')

    useEffect(() => {
        setSubmenuSelected(SubMenuSections.DESCARGAR_COMPRAS)
        consultar_Raggis()
    }, [])

    const consultar_Raggis = async () => {
        try {
            const response = await axios.get('/compras/raggi')
            setraggis(response.data.compras)
        } catch (error) {
            throw new Error(`${error}`)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setraggi_selected(e.target.value)
    }

    const Descargar_compra_liquidada = async () => {
        try {
            const response = await axios.get(`/compras/raggi/productos?id=${raggi_selected}`)
            const importacion = raggis.find(item => item.intIdDocumentoReferencia == parseInt(raggi_selected))
            if(importacion){
                Excel_Compras(response.data.productos,`ProductosLiquidadosCompra-${importacion?.strRaggi}`,importacion?.strImportacion)
            }else{
                console.error('Ha sucedido un error con la importacion')

            }
        
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <AppLayout>
            <div className='flex justify-center w-full'>
                <section className='w-full px-4 py-8 my-12 shadow-md md:w-1/2 h-a bg-slate-100'>
                    <label className='w-full'>
                        <p className='font-medium text-md'>Seleccione el raggi:</p>
                        <select
                            className='w-full px-4 py-2 my-2 border rounded border-slate-400 outline-slate-500'
                            value={raggi_selected}
                            onChange={handleChange}
                        >
                            {
                                raggis.map((raggi) => (
                                    <option key={raggi.intIdDocumentoReferencia} value={raggi.intIdDocumentoReferencia}>
                                        {raggi.strRaggi}
                                    </option>
                                ))
                            }
                        </select>
                    </label>

                    <div className='mt-4'>
                        <button
                            className='px-4 py-1 text-white bg-blue-700 rounded hover:bg-blue-800'
                            onClick={Descargar_compra_liquidada}
                        >
                            Descargar
                        </button>
                    </div>
                </section>
            </div>
        </AppLayout>
    )
}
