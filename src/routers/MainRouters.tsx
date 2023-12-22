import { HashRouter,Routes,Route } from "react-router-dom"
import { Login } from "../Views/Login/Login"
import App from "../App"
import Home from "../Views/home/Home"
import { Productos } from "../Views/Productos/Productos"
import { Pedidos } from "../Views/Pedidos/Pedidos"
import { PedidosPDF } from "../Views/pdfs/pedidos/PedidosPDF"
import { Portafolios } from "../Views/Portafolios/Portafolios"
import { CargarContenedor } from "../Views/Compras/CargarContenedor/CargarContenedor"
import { Catalogos } from "../Views/catalogos/Catalogos_Pdf/Catalogos"
import { Ver_Catalogos } from "../Views/catalogos/VerCatalogos/Ver_Catalogos"
import ROUTES_PATHS from "./Paths"
import { Liquidacion } from "../Views/Compras/Liquidar/Liquidacion"
import { Registro } from "../Views/Clientes/Registro/Registro"
import { Registro_Usuarios } from "../Views/Registro_Usuarios/Registro_Usuarios"
import { Movimientos } from "../Views/Movimientos/Movimientos"
import { Proceso_Pedidos } from "../Views/Proceso_pedidos/Proceso_Pedidos"
import { Crear_empleados } from "../Views/Administrador/Crear_empleados/Crear_empleados"
import { Permisos_Empleados } from "../Views/Administrador/Permisos_Empleados/Permisos_Empleados"
import { Crear_Permisos } from "../Views/Administrador/Permisos_Empleados/Crear_Permisos"

const MainRouters = () => {
    return(
        <HashRouter>
            <Routes>
                <Route path="/" Component={App} />
                <Route path={ROUTES_PATHS.LOGIN} Component={Login} />
                <Route path={ROUTES_PATHS.HOME} Component={Home} />
                <Route path={ROUTES_PATHS.PRODUCTOS} Component={Productos} />
                <Route path={ROUTES_PATHS.PEDIDOS} Component={Pedidos} />
                <Route path={ROUTES_PATHS.PORTAFOLIOS} Component={Portafolios} />
                <Route path={ROUTES_PATHS.CARGAR_COMPRAS} Component={CargarContenedor} />
                <Route path={ROUTES_PATHS.CATALOGOS} Component={Catalogos} />
                <Route path={ROUTES_PATHS.VER_CATALOGOS} Component={Ver_Catalogos} />
                <Route path={ROUTES_PATHS.LIQUIDACION} Component={Liquidacion} />
                <Route path={ROUTES_PATHS.REGISTRO_CLIENTES} Component={Registro} />
                <Route path={ROUTES_PATHS.CLIENTES_WEB_REGISTRADOS} Component={Registro_Usuarios} />
                <Route path={ROUTES_PATHS.MOVIMIENTOS} Component={Movimientos} />
                <Route path={ROUTES_PATHS.PROCESO_PEDIDOS} Component={Proceso_Pedidos} />
                <Route path={ROUTES_PATHS.CREAR_EMPLEADOS} Component={Crear_empleados} />
                <Route path={ROUTES_PATHS.PERMISOS_EMPLEADOS} Component={Permisos_Empleados} />
                <Route path={ROUTES_PATHS.CREAR_PERMISOS_EMPLEADOS}  Component={Crear_Permisos}/>


                <Route path="/pedidos/pdf/:pedidoId" Component={PedidosPDF}/>
            </Routes>
        </HashRouter>
    )
}

export default MainRouters