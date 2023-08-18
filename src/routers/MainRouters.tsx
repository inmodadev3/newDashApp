import { HashRouter,Routes,Route } from "react-router-dom"
import { Login } from "../Views/Login/Login"
import App from "../App"
import Home from "../Views/home/Home"
import { Productos } from "../Views/Productos/Productos"
import { Pedidos } from "../Views/Pedidos/Pedidos"
import { PedidosPDF } from "../Views/pdfs/pedidos/PedidosPDF"
import { Portafolios } from "../Views/Portafolios/Portafolios"
import { CargarContenedor } from "../Views/Compras/CargarContenedor/CargarContenedor"

const MainRouters = () => {
    return(
        <HashRouter>
            <Routes>
                <Route path="/" Component={App}/>
                <Route path="/login" Component={Login}/>
                <Route path="/home" Component={Home}/>
                <Route path="/productos" Component={Productos}/>
                <Route path="/Pedidos" Component={Pedidos}/>
                <Route path="/portafolios" Component={Portafolios}/>
                <Route path="/compras/cargar" Component={CargarContenedor}/>

                <Route path="/pedidos/pdf/:pedidoId" Component={PedidosPDF}/>
            </Routes>
        </HashRouter>
    )
}

export default MainRouters