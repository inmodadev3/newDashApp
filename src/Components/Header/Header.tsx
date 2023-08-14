import { useNavigate } from 'react-router-dom';
import './stylesHeader.css';

interface IDataUser {
  idLogin: number;
  intIdCompania: number;
  strClave: string;
  strIdVendedor: string;
  strNombreEmpleado: string;
  strUsuario: string;
  token: string;
}

export const Header = () => {
  const userData: string | null = localStorage.getItem('dataUser');
  let userInfo: IDataUser | null = null!;
  const navigate = useNavigate();

  if (userData) {
    userInfo = JSON.parse(userData);
  } else {
    navigate('/login');
  }

  const cerrarSesion = () =>{
    localStorage.removeItem("dataUser")
    navigate("/")
  }

  return (
    <header className="HeaderContainer">
      <div className='HeaderBasicInfo'>
        <span>DASH</span>
        <span className='HeaderNombreUsuario'>{userInfo?.strNombreEmpleado}</span>
      </div>
      <div className='HeaderBurguerOptions'>
        <span>Opciones</span>
      </div>
      <div>
        <span style={{ fontSize: '14px', cursor: 'pointer' }} onClick={cerrarSesion}>Cerrar Sesion</span>
      </div>
    </header>
  );
};
