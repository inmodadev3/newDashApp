import axios from '../../Utils/BaseUrlAxio';
import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../Components/AppLayout/AppLayout'
import { AgregarAlerta } from '../../Utils/Helpers';
import { BuscadorPortafolios } from '../../Components/Portafolios/BuscadorPortafolios/BuscadorPortafolios';
import { GestionesClientes } from '../../Components/Portafolios/GestionesClientes/GestionesClientes';
import { IDataUser } from '../../Utils/GlobalInterfaces';
import { InfoClientesPortafolio } from '../../Components/Portafolios/InfoClientes/InfoClientesPortafolio';
import { Loader } from '../../Components/LoadingPage/Loader';
import { MenuSelectedContext } from '../../Utils/UseContextProviders'
import { TablePortafolios } from '../../Components/Portafolios/TablePortafolios/TablePortafolios';
import { useNavigate } from 'react-router-dom';
import '../../Components/TablePedidos/stylesTablePedidos.css'
import '../Pedidos/styles/styles.css'
import { useAlert } from '../../hooks/useAlert';

interface IDataPropsPortafolio {
    Estado: string
    Nombre_tercero: string,
    StrIdTercero: string
    Viaja: string
    ciudad: string
    ultima_Compra: number
}

export const Portafolios: React.FC = () => {

    const navigate = useNavigate();
    const userData: string | null = localStorage.getItem('dataUser');
    let userInfo: IDataUser | null = null!;
    const [loadingData, setloadingData] = useState(true)
    const [datosClientes, setdatosClientes] = useState<IDataPropsPortafolio[] | null>(null)
    const [viewGestionesCliente, setviewGestionesCliente] = useState(false)
    const [viewInfoCliente, setviewInfoCliente] = useState(false)
    const [idClienteGestiones, setidClienteGestiones] = useState('')
    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const { alerts, createToast } = useAlert()

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

    useEffect(() => {
        if (userInfo && loadingData) {
            ConsultarPrimeraListaClientesXVendedor()
        }
    }, [userInfo])


    const ConsultarPrimeraListaClientesXVendedor = async () => {
        try {
            if (userInfo !== null) {
                const response = await axios.get(`/portafolios/${userInfo.strIdVendedor}`)
                setdatosClientes(response.data.data)
            }
        } catch (error) {
            AgregarAlerta(createToast, `${error}`, 'danger')
        } finally {
            setloadingData(false)
        }
    }

    return (
        <AppLayout>
            {
                !loadingData ? (
                    datosClientes !== null && userInfo !== null ? (
                        <>
                            <BuscadorPortafolios
                                setdatosClientes={setdatosClientes}
                                cedulaVendedor={userInfo.strIdVendedor}
                            />
                            <div className='TablePedidosContainer'>
                                <TablePortafolios data={datosClientes} setviewGestionesCliente={setviewGestionesCliente} setidClienteGestiones={setidClienteGestiones} setviewInfoCliente={setviewInfoCliente} />
                            </div>
                        </>
                    ) :
                        <h1>Sin datos</h1>
                ) : (
                    <Loader />
                )
            }
            {
                viewGestionesCliente && (
                    <GestionesClientes cedula={idClienteGestiones} setviewGestionesCliente={setviewGestionesCliente} idLogin={userInfo !== null ? userInfo.idLogin : 75} />
                )
            }
            {
                viewInfoCliente && (
                    <InfoClientesPortafolio setviewInfoCliente={setviewInfoCliente} cedula={idClienteGestiones} />
                )
            }
            {alerts}
        </AppLayout>
    )
}
