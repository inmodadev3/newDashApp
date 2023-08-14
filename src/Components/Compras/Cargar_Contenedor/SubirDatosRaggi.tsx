import axios from '../../../Utils/BaseUrlAxio'
import React, {  useState } from 'react'
import { useAlert } from '../../../hooks/useAlert'
import { AgregarAlerta } from '../../../Utils/Helpers'

export const SubirDatosRaggi: React.FC = () => {

  const [importacion, setImportacion] = useState('')
  const [raggi, setRaggi] = useState('')
  const [documento, setdocumento] = useState<File | null>(null)
  const {alerts,createToast} = useAlert()

  
  const CargarContenedor = async () => {
    try {
      const datosContenedor = new FormData()
      if (documento) {
        datosContenedor.append('file', documento);
        datosContenedor.append('importacion', importacion);
        datosContenedor.append('raggi', raggi);
        const cargarDatosContenedor = await axios.post(`/compras/cargar/detalles`, datosContenedor);
        AgregarAlerta(createToast,cargarDatosContenedor.data.message,'success')
      } else {
        AgregarAlerta(createToast,'No se ha seleccionado ningún archivo','danger')
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      AgregarAlerta(createToast,'Error al enviar el formulario','danger')

    }
  }



  return (
    <div className='h-full w-full flex items-center justify-center flex-col'>
      <h2 className='pb-4 text-2xl font-bold'>Datos para subir contenedor</h2>
      <div 
        className='flex flex-col box-border border-2 border-gray-600 w-9/12 h-auto rounded-xl bg-[#2f3c87] px-12 py-16 text-white'
      >
        <h3 className='mb-4 text-xl'>Archivo</h3>
        <div className='inputFile bg-[#75b628]'>
          <input type={'file'} onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
              setdocumento(file);
            }
          }} />
        </div>
        {
          documento?.name && (
            <p className='font-bold underline text-sm'>{documento.name}</p>
          )
        }
        <div className='flex flex-col mt-6'>
          <span className='font-bold mb-2 text-xl'>Importación</span>
          <input 
            type='text' 
            placeholder='Codigo de importacion' 
            className=' outline-none bg-transparent border-b-2 border-b-sky-300 py-2 px-3' 
            value={importacion} 
            onChange={(e) => { setImportacion(e.target.value) }} />
        </div>
        <div className='flex flex-col mt-6'>
          <span className='font-bold mb-2 text-xl'>Raggi</span>
          <input 
            type='text' 
            placeholder='Numero Raggi'
            className=' outline-none bg-transparent border-b-2 border-b-sky-300 py-2 px-3' 
            value={raggi} 
            onChange={(e) => { setRaggi(e.target.value) }} />
        </div>
        <div className='mt-12 flex justify-center items-center'>
          <button 
            onClick={CargarContenedor} 
            className='bg-[#75b628] px-6 py-3 rounded border-none hover:translate-y-2 transition-all duration-300'
          >
            Cargar Contenedor
          </button>
        </div>
      </div>
      {alerts}
    </div>
  )
}
