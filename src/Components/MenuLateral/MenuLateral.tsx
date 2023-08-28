import axios from '../../Utils/BaseUrlAxio.ts'
import { AiOutlineHome,AiOutlineFilePdf, AiOutlineSetting, AiOutlineShopping, AiOutlineShop, AiOutlineWallet, AiOutlineUser, AiOutlineSearch, AiOutlineArrowLeft, AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoContainer } from "react-icons/go";
import { HiOutlineDocumentReport, HiOutlineBriefcase } from "react-icons/hi";
import { IDataUser } from '../../Utils/GlobalInterfaces.ts';
import { MenuSelectedContext } from '../../Utils/UseContextProviders.tsx';
import { MdAttachMoney } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import './stylesMenu.css'

interface IFilterPermisos {
  idPermiso: number
}

interface MenuLateralProps {
  menuView: boolean;
  setmenuView: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MenuLateral: React.FC<MenuLateralProps> = ({ menuView, setmenuView }) => {

  const userData: string | null = localStorage.getItem('dataUser');
  let userInfo: IDataUser | null = null!;
  const [permisosArray, setpermisosArray] = useState([])
  const navigate = useNavigate();
  const { menuSelected, submenuSelected } = useContext(MenuSelectedContext);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showComprasMenu, setShowComprasMenu] = useState(false);

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

  const MenuItemRender = ({ icon, label, selected, onClick, iconOptional }: { icon: React.ReactNode, label: string, selected: boolean, onClick: () => any, iconOptional?: React.ReactNode }) => {
    return (
      <div className={`MenuOption ${selected ? 'MenuSelect' : ''}`} onClick={onClick}>
        {icon}
        <span>{label}</span>
        <span style={{marginLeft:'10px'}}>{iconOptional}</span>
  
      </div>
    )
  }

  const SubMenuItemRender = ({ icon, label, submenuSelected, onClick }: { icon: React.ReactNode, label: string, submenuSelected: boolean, onClick: () => any }) => {
    return (
      <div className={`SubMenuOption ${submenuSelected ? 'SubMenuSelect' : ""}`} onClick={onClick}>
        {icon}
        <span>{label}</span>
      </div>
    )

  }

  const MenuSections = {
    INICIO: 1,
    ADMINISTRADOR: 2,
    COMPRAS: 3,
    PEDIDOS: 4,
    CARTERA: 5,
    VENDEDORES: 6,
    INFORMES: 7,
    PORTAFOLIOS: 8,
    PRODUCTOS: 9,
    CATALOGOS_PDF:10,
    VER_CATALOGOS_PDF:11,
  }

  const SubMenuSections = {
    CARGAR_CONTENEDOR: 31,
    LIQUIDAR: 32
  }

  return (
    <>
      <div className={`MenuContainer ${menuView ? "ViewMenu" : "CloseMenu"}`}>
        <div className='MenuHeader'>
          <div className='w-36 h-36 bg-white rounded-full mb-6 flex items-center justify-center'>
            <img src="http://10.10.10.128/ownCloud/fotos_nube/INMODA.png" alt='logoInmoda' className="w-28"/>
          </div>
          <span>DASH</span>
          <span className='NameEmpleado'>{userInfo?.strNombreEmpleado}</span>
        </div>
        <nav>

          <MenuItemRender
              icon={<AiOutlineHome size={22} />}
              label="INICIO"
              selected={menuSelected === MenuSections.INICIO}
              onClick={() => {
                navigate('/home')
              }}
          />

          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 19) && (
              <MenuItemRender
                  icon={<AiOutlineSetting size={22} />}
                  label="Administrador"
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

          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 1) && (
              <MenuItemRender
                  icon={<AiOutlineShop size={22} />}
                  label="Compras"
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
                    navigate('/compras/cargar')
                  }}
              />
              <SubMenuItemRender
                  icon={<MdAttachMoney size={22} />}
                  label={"Liquidar"}
                  submenuSelected={submenuSelected === SubMenuSections.LIQUIDAR}
                  onClick={() => {
                    navigate('/compras/cargar')
                  }}
              />

            </>
          )}

          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 5) && (
              <MenuItemRender
                icon={<AiOutlineShopping size={22} />}
                label="Pedidos"
                selected={menuSelected === MenuSections.PEDIDOS}
                onClick={() => {
                  navigate('/pedidos')
                }}
              />
            )
          }

          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 8) && (
              <MenuItemRender
                icon={<AiOutlineWallet size={22} />}
                label="Cartera"
                selected={menuSelected === MenuSections.CARTERA}
                onClick={() => {
                  navigate('/cartera')
                }}
              />
            )
          }

          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 11) && (
              <MenuItemRender
                icon={<AiOutlineUser size={22} />}
                label="Vendedores"
                selected={menuSelected === MenuSections.VENDEDORES}
                onClick={() => {
                  navigate('/vendedores')
                }}
              />
            )
          }

          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 15) && (
              <MenuItemRender
                icon={<HiOutlineDocumentReport size={22} />}
                label="Informes"
                selected={menuSelected === MenuSections.INFORMES}
                onClick={() => {
                  navigate('/informes')
                }}
              />
            )
          }

          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 27) && (
              <MenuItemRender
                icon={<HiOutlineBriefcase size={22} />}
                label="PORTAFOLIOS"
                selected={menuSelected === MenuSections.PORTAFOLIOS}
                onClick={() => {
                  navigate('/portafolios')
                }}
              />
            )
          }
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 27) && (
              <MenuItemRender
                icon={<AiOutlineFilePdf size={22} />}
                label="CATALOGOS PDF'S"
                selected={menuSelected === MenuSections.CATALOGOS_PDF}
                onClick={() => {
                  navigate('/catalogos')
                }}
              />
            )
          }
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 27) && (
              <MenuItemRender
                icon={<AiOutlineFilePdf size={22} />}
                label="VER PDFS"
                selected={menuSelected === MenuSections.VER_CATALOGOS_PDF}
                onClick={() => {
                  navigate('/ver/catalogos')
                }}
              />
            )
          }
          
          {
            permisosArray.find((permiso: IFilterPermisos) => permiso.idPermiso === 43) && (
              <MenuItemRender
                icon={<AiOutlineSearch size={22} />}
                label="PRODUCTOS"
                selected={menuSelected === MenuSections.PRODUCTOS}
                onClick={() => {
                  navigate('/productos')
                }}
              />
            )
          }
        </nav>
        <div className='CerrarSesion'>
          <span onClick={cerrarSesion}>Cerrar Sesion</span>
        </div>

        <div className='arrowCloseView' onClick={() => { setmenuView(false) }}>
          <AiOutlineArrowLeft size={24} />
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
