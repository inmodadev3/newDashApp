import React, { useContext, useEffect, useState } from 'react'
import axios from '../../../Utils/BaseUrlAxio.ts'
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FcOpenedFolder } from "react-icons/fc";
import { AppLayout } from '../../../Components/AppLayout/AppLayout.tsx'
import { MenuSelectedContext } from '../../../Utils/UseContextProviders.tsx'
import { Loader } from '../../../Components/LoadingPage/Loader.tsx';
import { IDataUser } from '../../../Utils/GlobalInterfaces.ts';
import { useNavigate } from 'react-router-dom';
import { AgregarAlerta } from '../../../Utils/Helpers.ts';
import { useAlert } from '../../../hooks/useAlert.tsx';
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections.ts';
import './styles.css'

export const Catalogos: React.FC = () => {

  const defaultValuePath = 'http://10.10.10.128/ownCloud/fotos_nube/FOTOS%20%20POR%20SECCION%20CON%20PRECIO/'
  const userData: string | null = localStorage.getItem('dataUser');
  let userInfo: IDataUser | null = null!;
  const navigate = useNavigate()
  const { alerts, createToast } = useAlert()

  const [urlPath, seturlPath] = useState(defaultValuePath)
  const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
  const [arrayPaths, setarrayPaths] = useState<string[]>([])
  const [arrayImages, setarrayImages] = useState<string[]>([])
  const [arraRoutesPDF, setarraRoutesPDF] = useState<string[]>([])
  const [checkedRoutes, setcheckedRoutes] = useState<string[]>([])
  const [isLoading, setisLoading] = useState(true)
  const [selectPrecio, setselectPrecio] = useState<string>('1')

  if (userData) {
    userInfo = JSON.parse(userData);
  } else {
    navigate('/login');
  }

  useEffect(() => {
    setMenuSelected(MenuSections.CATALOGOS)
    setSubmenuSelected(SubMenuSections.CATALOGOS_PDF)
  }, [])

  useEffect(() => {
    fetchFolderPaths(urlPath);
  }, [urlPath])

  async function fetchFolderPaths(url?: string) {
    setisLoading(true)
    try {
      const response = await axios.post('/catalogos', { "ruta": url });
      const folderPaths = response.data.folderPaths;
      const imageFiles = response.data.imageFileNames
      setarrayPaths(folderPaths)
      setarrayImages(imageFiles)
      setisLoading(false)
    } catch (error) {
      setisLoading(false)
      console.error('Error fetching folder paths:', error);
      return [];
    }
  }

  const changeFolderRouteNext = (newPath: string) => {
    let ruta_actual = urlPath;
    seturlPath(ruta_actual + newPath)
  }

  const changeFolderRoutePrev = () => {
    let ruta_actual = urlPath;
    let particionar_ruta = ruta_actual.split('/')
    particionar_ruta.pop()
    particionar_ruta.pop()
    let newUrl = particionar_ruta.join('/') + "/"

    if (ruta_actual !== "http://10.10.10.128/ownCloud/fotos_nube/FOTOS%20%20POR%20SECCION%20CON%20PRECIO/") {
      seturlPath(newUrl)
    }

  }

  const addRoutePDF = (checked: boolean, path: string) => {
    setcheckedRoutes(prevCheckedRoutes => {
      const newCheckedRoutes = checked
        ? [...prevCheckedRoutes, path]
        : prevCheckedRoutes.filter(item => item !== path);
      return newCheckedRoutes;
    });

    setarraRoutesPDF(prevArraRoutesPDF => {
      const newRoutes = checked
        ? [...prevArraRoutesPDF, urlPath + path]
        : prevArraRoutesPDF.filter(item => item !== urlPath + path);
      return newRoutes;
    });

  };

  const GenerarPDF = () => {
    let routesSplitDefault: string[] = []
    arraRoutesPDF.forEach(route => {
      routesSplitDefault.push(decodeURI(route.split('http://10.10.10.128/ownCloud/fotos_nube/FOTOS%20%20POR%20SECCION%20CON%20PRECIO/')[1]))
    })

    if (arraRoutesPDF.length !== 0) {
      axios.post('/catalogos/generar', {
        "data": routesSplitDefault,
        "precio": selectPrecio,
        "userId": userInfo?.idLogin
      }).catch((err) => {
        console.error(err)
        AgregarAlerta(createToast, err, "danger")

      })

      AgregarAlerta(createToast, "PDF Agregado a la cola", "success")
      setarraRoutesPDF([])
      setcheckedRoutes([])
      setarrayPaths([])
      setselectPrecio('1')
      seturlPath(defaultValuePath)
      fetchFolderPaths()

    } else {
      AgregarAlerta(createToast, "Seleccione una linea", "warning")
    }


   
  }

  return (
    <AppLayout>
      <div className='container-catalogo'>
        {
          urlPath !== defaultValuePath && (
            <span onClick={changeFolderRoutePrev} className='absolute top-4 cursor-pointer'><AiOutlineArrowLeft size={25} /></span>
          )
        }

        <div className='flex justify-center items-center mt-6'>
          <select className='border-2 border-sky-500 px-12 py-1 rounded-md' value={selectPrecio} onChange={(e) => { setselectPrecio(e.target.value) }}>
            <option value={1}>precio 1</option>
            <option value={2}>precio 2</option>
            <option value={3}>precio 3</option>
            <option value={4}>precio 4</option>
          </select>
        </div>
        <section className='grid grid-cols-2 lg:grid-cols-3 gap-y-12 mt-12'>
          {
            !isLoading ?
              (
                arrayPaths.length !== 0 && (
                  arrayPaths.map((path, index) => (
                    <div className='flex flex-col items-center relative' key={index}>
                      <input checked={checkedRoutes.includes(path)} onChange={(e) => { addRoutePDF(e.target.checked, path) }} type='checkbox' className='absolute left-0 lg:left-20 top-0 bottom-0 w-6' />
                      <span onClick={() => { changeFolderRouteNext(path) }} className='max-w-sm flex justify-center items-center'><span className='cursor-pointer hover:scale-125 transition-all duration-300'><FcOpenedFolder size={80} /></span></span>
                      <h1 className='text-center' key={index}>{path.replace(/%20/g, ' ').replace('/', '')}</h1>
                    </div>
                  ))
                )
              ) : (
                <Loader />
              )
          }
          {
            !isLoading ?
              (
                arrayImages.length !== 0 && (
                  arrayImages.map((imagePath, index) => (
                    <div className='flex flex-col justify-center items-center' key={index}>
                      <img src={urlPath + imagePath} alt='Imagen' className='w-64' />
                      <span>{imagePath}</span>
                    </div>

                    /*  <p key={index}>{urlPath+imagePath}</p> */
                  ))
                )
              ) : (
                <Loader />
              )
          }
        </section>
        <div className='mt-12 flex justify-center'>
          <button onClick={GenerarPDF} className='bg-blue-900 text-white px-4 py-2 rounded shadow-md'>Generar PDF</button>
        </div>

      </div>

      {alerts}
    </AppLayout>
  )
}
