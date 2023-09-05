import axios from '../../Utils/BaseUrlAxio.ts'
import { AiOutlineHome, AiOutlineFilePdf, AiOutlineSetting, AiOutlineShopping, AiOutlineShop, AiOutlineWallet, AiOutlineUser, AiOutlineSearch, AiOutlineArrowLeft, AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoContainer } from "react-icons/go";
import { HiOutlineDocumentReport, HiOutlineBriefcase } from "react-icons/hi";
import { IDataUser } from '../../Utils/GlobalInterfaces.ts';
import { MenuSelectedContext } from '../../Utils/UseContextProviders.tsx';
import { MdAttachMoney } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import logo from '../../../assets/img/INMODA.png'
import './stylesMenu.css'
import { MenuSections, SubMenuSections } from './MenuSections.ts';
import ROUTES_PATHS from '../../routers/Paths.ts';

interface IFilterPermisos {
  idPermiso: number
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

  const ConsultarPermisos = () => {
    axios.get(`/usuarios/permisos/${userInfo?.idLogin}`, {
      headers: {
        Authorization: `Bearer ${userInfo?.token}`
      }
    }).then((response) => {
      if (response.data.success) {
        let dataPermisos = response.data.data
        setpermisosArray(dataPermisos)
      }
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
      <div className={`MenuContainer ${menuView ? "ViewMenu" : "CloseMenu"}`}>

        <div className='arrowCloseView' onClick={() => { setmenuView(false) }}>
          <AiOutlineArrowLeft size={24} />
        </div>

        <div className='MenuHeader'>
          <div className='w-36 h-36 bg-white rounded-full mb-6 flex items-center justify-center'>
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
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 19) && (
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

              <div className={`SubMenuOption `}>item 1</div>
              <div className={`SubMenuOption `}>item 2</div>
            </>
          )}

          {/*MENU COMPRAS*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 1) && (
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
                  navigate(ROUTES_PATHS.CARGAR_COMPRAS)
                }}
              />

            </>
          )}

          {/*MENU PEDIDOS*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 5) && (
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
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 8) && (
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

          {/*MENU VENDEDORES*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 11) && (
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
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 15) && (
              <MenuItemRender
                icon={<HiOutlineDocumentReport size={22} />}
                label="INFORMES"
                selected={menuSelected === MenuSections.INFORMES}
                onClick={() => {
                  navigate(ROUTES_PATHS.HOME)
                }}
              />
            )
          }

          {/*MENU PORTAFOLIOS*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 27) && (
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

          {/*MENU CATALOGOS*/}
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 27) && (
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
                  permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 27) && (
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
                  permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 27) && (
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
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 43) && (
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
