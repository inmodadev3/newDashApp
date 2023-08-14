import { useContext, useEffect } from "react"
import { MenuSelectedContext } from "../../Utils/UseContextProviders"
import { AppLayout } from "../../Components/AppLayout/AppLayout"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { PedidosNuevos } from "./PedidosNuevos";
import { PedidosProceso } from "./PedidosProceso";
import { PedidosTerminal } from "./PedidosTerminal";

export const Pedidos = () => {
    const { setMenuSelected,setSubmenuSelected } = useContext(MenuSelectedContext)

    useEffect(() => {
        setMenuSelected(4)
        setSubmenuSelected(0)
    }, [])


    return (
        <AppLayout>
            <Tabs>
                <TabList>
                    <Tab>Nuevos Pedidos</Tab>
                    <Tab>Pedidos En proceso</Tab>
                    <Tab>Pedidos En Terminal</Tab>
                </TabList>

                <TabPanel>
                    <PedidosNuevos/>
                </TabPanel>
                <TabPanel>
                    <PedidosProceso/>
                </TabPanel>
                <TabPanel>
                    <PedidosTerminal/>
                </TabPanel>
            </Tabs>
        </AppLayout>
    )
}
