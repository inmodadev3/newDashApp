import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import axios from '../../../Utils/BaseUrlAxio'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'
import { useNavigate } from 'react-router-dom'
import ROUTES_PATHS from '../../../routers/Paths'

type PropsEncargados = {
  id: number,
  nombre: string,
  tipo_encargado: string
  tipo_encargado_id: number,
  intEstado: number
}

export const Encargados: React.FC = () => {

  const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
  const [encargados, setencargados] = useState<PropsEncargados[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setMenuSelected(MenuSections.PEDIDOS)
    setSubmenuSelected(SubMenuSections.ENCARGADOS)
    consultarEncargados()
  }, [])

  const consultarEncargados = async () => {
    try {
      const response = await axios.get('/pedidos/encargadosDefault')
      setencargados(response.data.encargados)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AppLayout>
      <div className='pb-12'>
        <br />
        <article className='w-full flex justify-end items-end px-4 py-2'>
          <button
            className='bg-blue-600 text-white px-12 py-2 rounded hover:bg-blue-800 transition-all'
            onClick={()=>{navigate(ROUTES_PATHS.CREAR_ENCARGADOS)}}
          >
            Agregar
          </button>
        </article>
        <h1 className='text-4xl font-bold'>Encargados</h1>
        <section className='flex flex-col gap-y-4 my-8'>
          {encargados.length > 0 && (
            encargados.map((encargado) => (
              <div key={encargado.id}>
                <div

                  className='flex justify-between '
                >
                  <article>
                    <p className='text-xl font-bold'>{encargado.nombre}</p>
                    <p>{encargado.tipo_encargado}</p>
                  </article>

                  {/* <label className="switch">
                    <input
                      type="checkbox"
                      checked={encargado.intEstado == 1 ? true : false}
                      onChange={() => { }}
                    />
                    <span className="slider round"></span>
                  </label> */}
                </div>
                <hr className='border border-slate-300 w-full' />
              </div>

            ))
          )}
        </section>
      </div>
    </AppLayout>
  )
}
