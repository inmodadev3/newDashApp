import axios from '../../../Utils/BaseUrlAxio'
import React, { useState } from 'react'
import { useAlert } from '../../../hooks/useAlert'
import { AgregarAlerta } from '../../../Utils/Helpers'
import { AiOutlineDownload } from 'react-icons/ai'
import { BsSend } from 'react-icons/bs'
import { ModalsLayout } from '../../Modals/ModalsLayout'

type PropsModalRaggi = {
  setviewModalDataRaggi: React.Dispatch<React.SetStateAction<boolean>>
  importacion: string,
  setImportacion: React.Dispatch<React.SetStateAction<string>>
  raggi: string,
  setRaggi: React.Dispatch<React.SetStateAction<string>>
  enviar: () => any
}

const ModalRaggi: React.FC<PropsModalRaggi> = ({ setviewModalDataRaggi, importacion, setImportacion, raggi, setRaggi, enviar }) => {

  return (

    <ModalsLayout CloseEvent={setviewModalDataRaggi}>
      <section className='flex flex-col bg-white z-20 w-10/12 sm:w-2/4 lg:w-2/6 h-2/4 justify-evenly items-center rounded-lg'>
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
        <button onClick={enviar} className='flex gap-x-4 bg-blue-500 text-white justify-center items-center px-4 py-2 rounded'>
          <span><BsSend size={20} /></span>
          <span>Enviar Documento</span>
        </button>
      </section>
    </ModalsLayout>


  )
}

export const SubirDatosRaggi: React.FC = () => {

  const [importacion, setImportacion] = useState('')
  const [raggi, setRaggi] = useState('')
  const [documento, setdocumento] = useState<File | null>(null)
  const { alerts, createToast } = useAlert()

  //MODAL
  const [viewModalDataRaggi, setviewModalDataRaggi] = useState(false)


  const CargarContenedor = async () => {
    try {
      const datosContenedor = new FormData()
      if (documento) {
        datosContenedor.append('file', documento);
        datosContenedor.append('importacion', importacion);
        datosContenedor.append('raggi', raggi);
        const cargarDatosContenedor = await axios.post(`/compras/cargar/detalles`, datosContenedor);
        console.log(cargarDatosContenedor.data)
        setviewModalDataRaggi(false)
        setRaggi("")
        setImportacion("")
        setdocumento(null)
        AgregarAlerta(createToast, cargarDatosContenedor.data.message, 'success')
      } else {
        AgregarAlerta(createToast, 'No se ha seleccionado ningún archivo', 'danger')
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      AgregarAlerta(createToast, 'Error al enviar el formulario', 'danger')

    }
  }

  const handleViewModal = () => {
    if (documento) {
      setviewModalDataRaggi(true)
    } else {
      AgregarAlerta(createToast, "Se necesita un documento", 'warning')
    }
  }

  return (
    <section className='h-screen w-full flex items-center justify-center flex-col px-2'>
      {/* <h2 className='pb-4 text-2xl font-bold'>Datos para subir contenedor</h2> */}
      <article
        className='w-2/4 h-2/4 flex flex-col justify-center items-centerrounded-xl relative'
      >
        <label className='flex justify-center items-center min-w-full min-h-full'>
          <span className='z-20 absolute text-2xl text-white'>{documento?.name ? documento?.name : <AiOutlineDownload size={64} />}</span>
          <div className='inputFile min-h-full min-w-full bg-gray-700/60 z-10 rounded-xl'>
            <input className='w-full min-h-full' type={'file'} onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                setdocumento(file);
              }
            }} />
          </div>
        </label>


        {/* {
          documento?.name && (
            <p className='font-bold underline text-sm'>{documento.name}</p>
          )
        } */}
        {/* <div className='flex flex-col mt-6'>
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
        </div> */}

      </article>

      <div className='mt-12 flex justify-center items-center'>
        <button
          /* onClick={CargarContenedor} */
          onClick={handleViewModal}
          className='bg-blue-500 text-white px-6 py-3 rounded border-none hover:translate-y-1 transition-all duration-300'
        >
          Cargar Documento
        </button>
      </div>

      {viewModalDataRaggi &&
        (
          <ModalRaggi
            setviewModalDataRaggi={setviewModalDataRaggi}
            importacion={importacion}
            setImportacion={setImportacion}
            raggi={raggi}
            setRaggi={setRaggi}
            enviar={CargarContenedor}
          />
        )}

      {alerts}
    </section>
  )
}
