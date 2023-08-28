import { HashRouter,Routes,Route } from "react-router-dom"
import { Login } from "../Views/Login/Login"
import App from "../App"
import Home from "../Views/home/Home"
import { Productos } from "../Views/Productos/Productos"
import { Pedidos } from "../Views/Pedidos/Pedidos"
import { PedidosPDF } from "../Views/pdfs/pedidos/PedidosPDF"
import { Portafolios } from "../Views/Portafolios/Portafolios"
import { CargarContenedor } from "../Views/Compras/CargarContenedor/CargarContenedor"
import { Catalogos } from "../Views/Catalogos_Pdf/Catalogos"
import { Ver_Catalogos } from "../Views/VerCatalogos/Ver_Catalogos"

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
                <Route path="/catalogos" Component={Catalogos}/>
                <Route path="/ver/catalogos" Component={Ver_Catalogos}/>

                <Route path="/pedidos/pdf/:pedidoId" Component={PedidosPDF}/>
            </Routes>
        </HashRouter>
    )
}

export default MainRouters