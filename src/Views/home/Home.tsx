import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../Components/AppLayout/AppLayout"
import { IDataUser } from "../../Utils/GlobalInterfaces";
import { useContext, useEffect } from 'react'
import './stylesHome.css'
import { MenuSelectedContext } from "../../Utils/UseContextProviders";


const Home = () => {
    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext);
    const userData: string | null = localStorage.getItem('dataUser');
    let userInfo: IDataUser | null = null!;
    const navigate = useNavigate()
    if (userData) {
        userInfo = JSON.parse(userData);
    } else {
        navigate('/login');
    }

    useEffect(() => {
        setMenuSelected(1)
        setSubmenuSelected(0)
    }, [])

   
    return (
        <AppLayout>
            <div className="homeContainer">
                <span style={{ fontSize: '24px' }}>Bienvenido : <span style={{ fontWeight: 'bold' }}>{userInfo?.strNombreEmpleado}</span></span>
            </div>
        </AppLayout>
    )
}

export default Home