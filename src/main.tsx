import ReactDOM from 'react-dom/client'
import MainRouters from './routers/MainRouters.tsx'
import './stylesMain.css'
import 'react-notifications/lib/notifications.css';
import './index.css'
import { MenuSelectedProvider } from './Utils/UseContextProviders.tsx'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <MenuSelectedProvider>
        <MainRouters />
    </MenuSelectedProvider>
)
