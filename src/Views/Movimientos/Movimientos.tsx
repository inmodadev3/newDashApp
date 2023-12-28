import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../Utils/UseContextProviders'
import { MenuSections } from '../../Components/MenuLateral/MenuSections'
import { IDataUser } from '../../Utils/GlobalInterfaces'
import { useNavigate } from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Facturas_Movimientos } from './Facturas_Movimientos'
import { Cartera_Movimientos } from './Cartera_Movimientos'
import './styles.css'
import { FormateoNumberInt } from '../../Utils/Helpers'
import { Recaudos_Movimientos } from './Recaudos_Movimientos'
import { Liquidadas_Movimientos } from './Liquidadas_Movimientos'


export const Movimientos: React.FC = () => {

  const userData: string | null = localStorage.getItem('dataUser');
  let userInfo: IDataUser | null = null!;
  const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
  const navigate = useNavigate()

  const [LoadingMovimiento, setLoadingMovimiento] = useState(true)
  const [fechas, setfechas] = useState<string[]>([])
  const [mes, setmes] = useState(0)
  const [año, setaño] = useState(0)
  const [tab_seleccionado, settab_seleccionado] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [totalSinIva, settotalSinIva] = useState<number>(0)
  const [total_Pagar, settotal_Pagar] = useState<number>(0)

  useEffect(() => {
    setMenuSelected(MenuSections.MOVIMIENTOS)
    setSubmenuSelected(0)
    get_Fechas()
    setmes(new Date().getMonth() + 1)
    setaño(new Date().getFullYear())
  }, [])

  useEffect(() => {
    if (total !== 0) {
      setTotal(0)
    }
  }, [tab_seleccionado])


  if (userData) {
    userInfo = JSON.parse(userData);
  } else {
    navigate('/login');
  }

  const get_Fechas = () => {
    const año_actual = new Date().getFullYear()
    const array_años: string[] = []

    //CONSEGUIR 4 años extra atras
    for (let i = 0; i < 5; i++) {
      array_años.push((año_actual - i).toString())
    }

    setfechas(array_años)
  }

  const handleMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setmes(parseInt(value))
    setLoadingMovimiento(true)
  }

  const handleYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setaño(parseInt(value))
    setLoadingMovimiento
  }






  return (
    <AppLayout>
      <div className='w-full h-screen px-1'>
        <article className='my-12'>
          <h1 className='text-2xl font-medium tracking-wide'>Movimientos</h1>
        </article>
        <section>
          <div className='flex space-x-4'>
            <label className='flex flex-col space-y-2'>
              <span className='font-semibold tracking-wide'>Vendedor</span>
              <input
                type='text'
                placeholder='Vendedor'
                disabled
                className='w-80 border rounded border-gray-300 px-2 py-1 outline-none text-sm text-gray-500 h-8'
                value={userInfo?.strNombreEmpleado}
              />
            </label>

            {
              tab_seleccionado !== 1 && (
                <>
                  <label className='flex flex-col space-y-2'>
                    <span className='font-semibold tracking-wide'>Mes</span>
                    <select value={mes} className='w-52 border border-gray-300 h-8 outline-none px-2 py-1 rounded' onChange={handleMonth}>
                      <option value={1}>Enero</option>
                      <option value={2}>Febrero</option>
                      <option value={3}>Marzo</option>
                      <option value={4}>Abril</option>
                      <option value={5}>Mayo</option>
                      <option value={6}>Junio</option>
                      <option value={7}>Julio</option>
                      <option value={8}>Agosto</option>
                      <option value={9}>Septiembre</option>
                      <option value={10}>Octubre</option>
                      <option value={11}>Noviembre</option>
                      <option value={12}>Diciembre</option>
                    </select>
                  </label>

                  <label className='flex flex-col space-y-2'>
                    <span className='font-semibold tracking-wide'>Año</span>
                    <select value={año} onChange={handleYear} className='w-52 border border-gray-300 h-8 outline-none px-2 py-1 rounded'>
                      {
                        fechas.map((ano, index) => (
                          <option key={index} value={ano}>{ano}</option>
                        ))
                      }
                    </select>
                  </label>
                </>
              )
            }
          </div>
          <div className='font-bold text-sm my-2'>
            <span>{tab_seleccionado !== 1 ? 'Total' : 'Total Propias'} : </span>
            <span>{FormateoNumberInt(total.toString())} $</span>
          </div>
          <div className={`${tab_seleccionado !== 0 && 'hidden'} font-bold text-sm`}>
            <span>Total sin iva: </span>
            <span>{FormateoNumberInt(totalSinIva.toString())}  </span>
          </div>
          {
            tab_seleccionado == 3 && (
              <div className='font-bold text-sm my-2'>
                <span>Total a pagar : </span>
                <span>{FormateoNumberInt(total_Pagar.toString())} $</span>
              </div>
            )
          }
        </section>
        <section className='mt-5'>
          <Tabs defaultIndex={0} onSelect={(e) => settab_seleccionado(e)}>
            <TabList>
              <Tab>Facturas</Tab>
              <Tab>Cartera</Tab>
              <Tab>Recaudos</Tab>
              <Tab>Liquidadas</Tab>
            </TabList>

            {/* FACTURAS */}
            <TabPanel>
              <Facturas_Movimientos setLoadingMovimiento={setLoadingMovimiento} LoadingMovimiento={LoadingMovimiento} mes={mes} año={año} strIdVendedor={userInfo ? userInfo?.strIdVendedor : '1'} setTotal={setTotal} setTotalNoIva={settotalSinIva}/>
            </TabPanel>

            {/* CARTERA */}
            <TabPanel>
              <Cartera_Movimientos setLoadingMovimiento={setLoadingMovimiento} LoadingMovimiento={LoadingMovimiento} strIdVendedor={userInfo ? userInfo?.strIdVendedor : '1'} setTotal={setTotal} />
            </TabPanel>
            {/* RECAUDOS */}
            <TabPanel>
              <Recaudos_Movimientos setLoadingMovimiento={setLoadingMovimiento} LoadingMovimiento={LoadingMovimiento} mes={mes} año={año} strIdVendedor={userInfo ? userInfo?.strIdVendedor : '1'} setTotal={setTotal} />
            </TabPanel>
            {/* LIQUIDADAS */}
            <TabPanel>
              <Liquidadas_Movimientos setLoadingMovimiento={setLoadingMovimiento} LoadingMovimiento={LoadingMovimiento} mes={mes} año={año} strIdVendedor={userInfo ? userInfo?.strIdVendedor : '1'} setTotal={setTotal} settotal_Pagar={settotal_Pagar}/>
            </TabPanel>
          </Tabs>
        </section>
      </div>
    </AppLayout>
  )
}
