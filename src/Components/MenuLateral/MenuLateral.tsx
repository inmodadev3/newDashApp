import axios from '../../Utils/BaseUrlAxio.ts'
import ROUTES_PATHS from '../../routers/Paths.ts';
import { AiOutlineHome, AiOutlineFilePdf, AiOutlineSetting, AiOutlineShopping, AiOutlineShop, AiOutlineWallet, AiOutlineUser, AiOutlineSearch, AiOutlineArrowLeft, AiFillCaretDown, AiFillCaretUp, AiOutlineUserAdd, AiOutlineFile, AiOutlineInfoCircle } from "react-icons/ai";
import { GiHamburgerMenu, GiNotebook } from "react-icons/gi";
import { GoContainer } from "react-icons/go";
import { HiOutlineDocumentReport, HiOutlineBriefcase } from "react-icons/hi";
import { IDataUser } from '../../Utils/GlobalInterfaces.ts';
import { MenuSelectedContext } from '../../context/UseContextProviders.tsx';
import { MdAttachMoney, MdOutlineDownloading} from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import logo from '../../../assets/img/INMODA.png'
import { MenuSections, SubMenuSections } from './MenuSections.ts';
import './stylesMenu.css'
import { PermisosContext } from '../../context/permisosContext.tsx';

interface IFilterPermisos {
  id_permiso: number
}

interface MenuLateralProps {
  menuView: boolean;
  setmenuView: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuItemRender = ({ icon, label, selected, onClick, iconOptional }: { icon: React.ReactNode, label: string, selected: boolean, onClick: () => any, iconOptional?: React.ReactNode }) => {
  return (
    <div className={`MenuOption ${selected ? 'MenuSelect' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      <span style={{ marginLeft: '10px' }}>{iconOptional}</span>

    </div>
  )
}

const SubMenuItemRender = ({ icon, label, submenuSelected, onClick }: { icon: React.ReactNode, label: string, submenuSelected: boolean, onClick: () => any }) => {
  return (
    <div className={`SubMenuOption hover:bg-blue-700 ${submenuSelected ? 'bg-lime-700' : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </div>
  )

}


export const MenuLateral: React.FC<MenuLateralProps> = ({ menuView, setmenuView }) => {

  const userData: string | null = localStorage.getItem('dataUser');
  let userInfo: IDataUser | null = null!;
  const [permisosArray, setpermisosArray] = useState([])
  const { menuSelected, submenuSelected } = useContext(MenuSelectedContext);
  const {setPermisos} = useContext(PermisosContext)
  const navigate = useNavigate();

  //VISUALIZACION DE SUBMENUS
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showComprasMenu, setShowComprasMenu] = useState(false);
  const [showCatalogosMenu, setshowCatalogosMenu] = useState(false)

  if (userData) {
    userInfo = JSON.parse(userData);
  } else {
    navigate('/login');
  }

  useEffect(() => {
    if (userInfo) {
      ConsultarPermisos()
    }
  }, [])

  useEffect(()=>{
    if(permisosArray.length > 0){
      setPermisos(permisosArray)
    }
  },[permisosArray])


  const ConsultarPermisos = () => {
    axios.get(`/permisos/${userInfo?.idLogin}`, {
      headers: {
        Authorization: `Bearer ${userInfo?.token}`
      }
    }).then((response) => {
      let dataPermisos = response.data.permisos
      setpermisosArray(dataPermisos)
    }).catch((err) => {
      if (err.response.status === 403) {
        cerrarSesion()
      }
    })
  }


  const cerrarSesion = () => {
    localStorage.removeItem("dataUser")
    navigate("/")
  }

  return (
    <>
      <div className={`MenuContainer ${menuView ? "ViewMenu" : "CloseMenu"} fixed`}>

        <div className='arrowCloseView' onClick={() => { setmenuView(false) }}>
          <AiOutlineArrowLeft size={24} />
        </div>

        <div className='MenuHeader'>
          <div className='flex items-center justify-center mb-6 bg-white rounded-full w-36 h-36'>
            <img src={logo} alt='logoInmoda' className="w-28" />
          </div>
          <span>DASH</span>
          <span className='NameEmpleado'>{userInfo?.strNombreEmpleado}</span>
        </div>

        <nav>

          {/*MENU INICIO*/}
          <MenuItemRender
            icon={<AiOutlineHome size={22} />}
            label="INICIO"
            selected={menuSelected === MenuSections.INICIO}
            onClick={() => {
              navigate(ROUTES_PATHS.HOME)
            }}
          />

          {/*MENU ADMINISTRACION*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 1) && (
              <MenuItemRender
                icon={<AiOutlineSetting size={22} />}
                label="ADMINISTRADOR"
                selected={menuSelected === MenuSections.ADMINISTRADOR}
                onClick={() => {
                  setShowAdminMenu(!showAdminMenu);
                }}
                iconOptional={showAdminMenu ? <AiFillCaretUp size={22} /> : <AiFillCaretDown size={22} />}
              />
            )
          }
          {showAdminMenu && (
            <>

              <SubMenuItemRender
                icon={<AiOutlineUser size={22} />}
                label={"Empleados"}
                submenuSelected={submenuSelected === SubMenuSections.CREAR_EMPLEADO}
                onClick={() => {
                  navigate(ROUTES_PATHS.CREAR_EMPLEADOS)
                }}
              />
              <SubMenuItemRender
                icon={<GiNotebook size={22} />}
                label={"Permisos"}
                submenuSelected={submenuSelected === SubMenuSections.PERMISOS_EMPLEADO}
                onClick={() => {
                  navigate(ROUTES_PATHS.PERMISOS_EMPLEADOS)
                }}
              />
            </>
          )}

          {/*MENU COMPRAS*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 2) && (
              <MenuItemRender
                icon={<AiOutlineShop size={22} />}
                label="COMPRAS"
                selected={menuSelected === MenuSections.COMPRAS}
                onClick={() => {
                  setShowComprasMenu(!showComprasMenu)
                }}
                iconOptional={showComprasMenu ? <AiFillCaretUp size={22} /> : <AiFillCaretDown size={22} />}
              />
            )
          }
          {showComprasMenu && (
            <>
              <SubMenuItemRender
                icon={<GoContainer size={22} />}
                label={"Cargar Contenedor"}
                submenuSelected={submenuSelected === SubMenuSections.CARGAR_CONTENEDOR}
                onClick={() => {
                  navigate(ROUTES_PATHS.CARGAR_COMPRAS)
                }}
              />
              <SubMenuItemRender
                icon={<MdAttachMoney size={22} />}
                label={"Liquidar"}
                submenuSelected={submenuSelected === SubMenuSections.LIQUIDAR}
                onClick={() => {
                  navigate(ROUTES_PATHS.LIQUIDACION)
                }}
              />

              <SubMenuItemRender
                icon={<MdOutlineDownloading size={22} />}
                label={"liquidadas"}
                submenuSelected={submenuSelected === SubMenuSections.DESCARGAR_COMPRAS}
                onClick={() => {
                  navigate(ROUTES_PATHS.DESCARGAR_LIQUIDADAS)
                }}
              />

            </>
          )}

          {/*MENU PEDIDOS*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 3) && (
              <MenuItemRender
                icon={<AiOutlineShopping size={22} />}
                label="PEDIDOS"
                selected={menuSelected === MenuSections.PEDIDOS}
                onClick={() => {
                  navigate(ROUTES_PATHS.PEDIDOS)
                }}
              />
            )
          }

          {/*MENU CARTERA*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 4) && (
              <MenuItemRender
                icon={<AiOutlineWallet size={22} />}
                label="CARTERA"
                selected={menuSelected === MenuSections.CARTERA}
                onClick={() => {
                  navigate(ROUTES_PATHS.HOME)
                }}
              />
            )
          }

          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 5) && (
              <MenuItemRender
                icon={<AiOutlineUserAdd size={22} />}
                label="REGISTRO USUARIOS WEB"
                selected={menuSelected === MenuSections.USUARIOS_REGISTRADOS}
                onClick={() => {
                  navigate(ROUTES_PATHS.CLIENTES_WEB_REGISTRADOS)
                }}
              />
            )
          }

          {/*MENU VENDEDORES*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 6) && (
              <MenuItemRender
                icon={<AiOutlineUser size={22} />}
                label="VENDEDORES"
                selected={menuSelected === MenuSections.VENDEDORES}
                onClick={() => {
                  navigate(ROUTES_PATHS.HOME)
                }}
              />
            )
          }

          {/*MENU INFORMES*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 7) && (
              <MenuItemRender
                icon={<HiOutlineDocumentReport size={22} />}
                label="INFORMES"
                selected={menuSelected === MenuSections.INFORMES}
                onClick={() => {
                  navigate(ROUTES_PATHS.INFORMES)
                }}
              />
            )
          }

          {/*MENU PORTAFOLIOS*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 8) && (
              <MenuItemRender
                icon={<HiOutlineBriefcase size={22} />}
                label="PORTAFOLIOS"
                selected={menuSelected === MenuSections.PORTAFOLIOS}
                onClick={() => {
                  navigate(ROUTES_PATHS.PORTAFOLIOS)
                }}
              />
            )
          }

          {/* MENU DE PEDIDOS EN PROCESO TIENDA */}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 9) && (
              <MenuItemRender
                icon={<AiOutlineInfoCircle size={22} />}
                label="PROCESO DE PEDIDOS"
                selected={menuSelected === MenuSections.PROCESO_PEDIDOS}
                onClick={() => {
                  navigate(ROUTES_PATHS.PROCESO_PEDIDOS)
                }}
              />
            )
          }
          {/*MENU CATALOGOS*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 10) && (
              <MenuItemRender
                icon={<AiOutlineFilePdf size={22} />}
                label="CATALOGOS"
                selected={menuSelected === MenuSections.CATALOGOS}
                onClick={() => {
                  setshowCatalogosMenu(!showCatalogosMenu)
                }}
                iconOptional={showCatalogosMenu ? <AiFillCaretUp size={22} /> : <AiFillCaretDown size={22} />}
              />
            )
          }

          {
            showCatalogosMenu && (
              <>
                {
                  permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 10) && (
                    <SubMenuItemRender
                      icon={<AiOutlineFilePdf size={22} />}
                      label="Generar PDF'S"
                      submenuSelected={submenuSelected === SubMenuSections.CATALOGOS_PDF}
                      onClick={() => {
                        navigate(ROUTES_PATHS.CATALOGOS)
                      }}
                    />
                  )
                }
                {
                  permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 10) && (
                    <SubMenuItemRender
                      icon={<AiOutlineFilePdf size={22} />}
                      label="Ver PDFS"
                      submenuSelected={submenuSelected === SubMenuSections.VER_CATALOGOS_PDF}
                      onClick={() => {
                        navigate(ROUTES_PATHS.VER_CATALOGOS)
                      }}
                    />
                  )
                }
              </>
            )
          }

          {/*MENU MOVIMIENTOS*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 11) && (
              <MenuItemRender
                icon={<AiOutlineFile size={22} color={'white'} />}
                label="MOVIMIENTOS"
                selected={menuSelected === MenuSections.MOVIMIENTOS}
                onClick={() => {
                  navigate(ROUTES_PATHS.MOVIMIENTOS)
                }}
              />
            )
          }

          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.id_permiso === 12) && (
              <MenuItemRender
                icon={<AiOutlineSearch size={22} />}
                label="PRODUCTOS"
                selected={menuSelected === MenuSections.PRODUCTOS}
                onClick={() => {
                  navigate(ROUTES_PATHS.PRODUCTOS)
                }}
              />
            )
          }

        </nav>

        <div className='CerrarSesion'>
          <span onClick={cerrarSesion}>Cerrar Sesion</span>
        </div>
      </div>

      <nav className={` ${menuView ? "containerBurguerClose" : "containerBurguer"}`} >
        <GiHamburgerMenu size={24} className={"burguerView"} color={"white"} onClick={() => { setmenuView(true) }} />
        <span className='DashNameMenuClose'></span>
        <span className='NameEmpleadoMenuClose'>{userInfo?.strNombreEmpleado}</span>
      </nav>
    </>

  )
}
