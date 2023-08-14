import { useContext, useEffect, useState } from "react"
import { MenuSelectedContext } from "../../Utils/UseContextProviders"
import { AppLayout } from "../../Components/AppLayout/AppLayout"
import { ProductosBuscador } from "./ProductosBuscador"
import { IArrayProductos, IDataUser } from "../../Utils/GlobalInterfaces"
import { useNavigate } from "react-router-dom"
import { ProductoCard } from "./ProductoCard"
import './Styles/stylesProductos.css'
import { Loader } from "../../Components/LoadingPage/Loader"

export const Productos = () => {

    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const [arrayProductos, setarrayProductos] = useState<IArrayProductos[]>([])
    const [loadProductos, setloadProductos] = useState<boolean>(false)
    const navigate = useNavigate()
    const userData: string | null = localStorage.getItem('dataUser');
    let userInfo: IDataUser | null = null!;

    if (userData) {
        userInfo = JSON.parse(userData);
    } else {
        navigate('/login');
    }

    useEffect(() => {
        setMenuSelected(9)
        setSubmenuSelected(0)
    }, [])


    return (
        <AppLayout >
            <div className="arrayCardsBody">
                <ProductosBuscador setarrayProductos={setarrayProductos} userInfo={userInfo} setloadProductos={setloadProductos} />
                {
                    !loadProductos ? (
                        <div className={`${arrayProductos.length !== 1
                            ? "grid grid-cols-1 md:grid-cols-2 gap-5 px-6 py-12 place-items-center"
                            : "flex justify-center items-center py-4"}`}>
                            {
                                arrayProductos.length > 0 ? (
                                    arrayProductos.map((producto: IArrayProductos) => (
                                        <ProductoCard producto={producto} key={producto.referencia} />
                                    ))
                                ):(
                                    <h1 className="text-center col-span-2 text-2xl">Digite una referencia valida</h1>
                                )
                            }
                        </div>
                    ):(
                        <Loader/>
                    )
                    }

            </div>

        </AppLayout>
    )
}
