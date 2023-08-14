import { MenuLateral } from "../MenuLateral/MenuLateral"
import './stylesAppLayout.css'
import { useState } from 'react'

interface AppLayoutProps {
  children: any
}

export const AppLayout:React.FC<AppLayoutProps> = ({children}) => {

  const [menuView, setmenuView] = useState(true)


  return (
    <div className=" bg-gray-10/20">
      <MenuLateral menuView={menuView} setmenuView={setmenuView}/>
      <div className={`childrenContainer ${menuView?"":"menuCloseContainer"} relative`}>
          {children}
      </div>
    </div>
  )
}
