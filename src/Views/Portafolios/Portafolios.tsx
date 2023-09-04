import axios from '../../Utils/BaseUrlAxio';
import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../Components/AppLayout/AppLayout'
import { BuscadorPortafolios } from '../../Components/Portafolios/BuscadorPortafolios/BuscadorPortafolios';
import { GestionesClientes } from '../../Components/Portafolios/GestionesClientes/GestionesClientes';
import { IDataUser } from '../../Utils/GlobalInterfaces';
import { InfoClientesPortafolio } from '../../Components/Portafolios/InfoClientes/InfoClientesPortafolio';
import { Loader } from '../../Components/LoadingPage/Loader';
import { MenuSelectedContext } from '../../Utils/UseContextProviders'
import { TablePortafolios } from '../../Components/Portafolios/TablePortafolios/TablePortafolios';
import { useNavigate } from 'react-router-dom';

interface IDataPropsPortafolio {
    Estado: string
    Nombre_tercero: string,
    StrIdTercero: string
    Viaja: string
    ciudad: string
    ultima_Compra: number
}

export const Portafolios: React.FC = () => {

    const userData: string | null = localStorage.getItem('dataUser');
    let userInfo: IDataUser | null = null!;
    const [loadingData, setloadingData] = useState(true)
    const [datosClientes, setdatosClientes] = useState<IDataPropsPortafolio[] | null>(null)
    const [viewGestionesCliente, setviewGestionesCliente] = useState(false)
    const [viewInfoCliente, setviewInfoCliente] = useState(false)
    const [idClienteGestiones, setidClienteGestiones] = useState('')
    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const navigate = useNavigate();

    if (userData) {
        userInfo = JSON.parse(userData);
    } else {
        navigate('/login');
    }

    useEffect(() => {
        setMenuSelected(8)
        setSubmenuSelected(0)
    }, [])

    useEffect(() => {
        if (userInfo && loadingData) {
            ConsultarPrimeraListaClientesXVendedor()
        }
    }, [userInfo])


    const ConsultarPrimeraListaClientesXVendedor = () => {
        if (userInfo !== null) {
            axios.get(`/portafolios/${userInfo.strIdVendedor}`)
                .then((response) => {
                    setdatosClientes(response.data.data)
                    setloadingData(false)
                }).catch((err) => {
                    console.error(err)
                })
        }
    }


    return (
        <AppLayout>
            {
                !loadingData ? (
                    datosClientes !== null && userInfo !== null ? (
                        <>
                            <BuscadorPortafolios setdatosClientes={setdatosClientes} cedulaVendedor={userInfo.strIdVendedor} />
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

        </AppLayout>
    )
}
