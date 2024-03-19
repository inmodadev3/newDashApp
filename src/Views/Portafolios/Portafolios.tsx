import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../Components/AppLayout/AppLayout'
import { BuscadorPortafolios } from '../../Components/Portafolios/BuscadorPortafolios/BuscadorPortafolios';
import { GestionesClientes } from '../../Components/Portafolios/GestionesClientes/GestionesClientes';
import { IDataUser } from '../../Utils/GlobalInterfaces';
import { InfoClientesPortafolio } from '../../Components/Portafolios/InfoClientes/InfoClientesPortafolio';
import { Loader } from '../../Components/LoadingPage/Loader';
import { MenuSelectedContext } from '../../context/UseContextProviders'
import { TablePortafolios } from '../../Components/Portafolios/TablePortafolios/TablePortafolios';
import { useNavigate } from 'react-router-dom';
import '../../Components/TablePedidos/stylesTablePedidos.css'
import '../Pedidos/styles/styles.css'
import { useAlert } from '../../hooks/useAlert';

export interface IDataPropsPortafolio {
    Estado: string
    Nombre_tercero: string,
    StrIdTercero: string
    Viaja: string
    ciudad: string
    ultima_Compra: number
    ultima_gestion: Date
}

export const Portafolios: React.FC = () => {

    const navigate = useNavigate();
    const userData: string | null = localStorage.getItem('dataUser');
    let userInfo: IDataUser | null = null!;
    const [loadingData, setloadingData] = useState(true)
    const [datosClientes, setdatosClientes] = useState<IDataPropsPortafolio[] | null>(null)
    const [viewGestionesCliente, setviewGestionesCliente] = useState(false)
    const [viewInfoCliente, setviewInfoCliente] = useState(false)
    const [idClienteGestiones, setidClienteGestiones] = useState({
        stridCedula: '',
        strNombre: ''
    })
    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const { alerts } = useAlert()
    const [paginas, setpaginas] = useState(0)
    const [pagina, setpagina] = useState(0)


    if (userData) {
        userInfo = JSON.parse(userData);
    } else {
        navigate('/login');
    }

    useEffect(() => {
        setMenuSelected(8)
        setSubmenuSelected(0)
        window.document.title = "Panel - Portafolio"
    }, [])

    return (
        <AppLayout>
            {
                (userInfo !== null) ? (
                    <BuscadorPortafolios
                        setdatosClientes={setdatosClientes}
                        setPaginas={setpaginas}
                        paginas={paginas}
                        setPagina={setpagina}
                        pagina={pagina}
                        cedulaVendedor={userInfo.strIdVendedor}
                        setloadingData={setloadingData}
                    />
                ) :
                    (
                        <h1>Sin datos</h1>
                    )
            }
            {
                !loadingData && datosClientes !== null ? (

                    <>

                        <div className='TablePedidosContainer'>
                            <TablePortafolios data={datosClientes} setviewGestionesCliente={setviewGestionesCliente} setidClienteGestiones={setidClienteGestiones} setviewInfoCliente={setviewInfoCliente} />
                        </div>
                    </>


                ) : (
                    <Loader />
                )
            }
            {
                viewGestionesCliente && (
                    <GestionesClientes setdatosClientes={setdatosClientes} datosClientes={datosClientes} cedula={idClienteGestiones} setviewGestionesCliente={setviewGestionesCliente} idLogin={userInfo !== null ? userInfo.idLogin : 75} />
                )
            }
            {
                viewInfoCliente && (
                    <InfoClientesPortafolio setviewInfoCliente={setviewInfoCliente} cedula={idClienteGestiones.stridCedula} setviewGestionesCliente={setviewGestionesCliente} setidClienteGestiones={setidClienteGestiones} />
                )
            }
            {alerts}
        </AppLayout>
    )
}
