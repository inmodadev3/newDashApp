import { MenuLateral } from "../MenuLateral/MenuLateral"
import './stylesAppLayout.css'
import { useEffect, useState } from 'react'

interface AppLayoutProps {
  children: any
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {

  const [menuView, setmenuView] = useState(true)

  useEffect(()=>{
    if(isMobile()){setmenuView(false)}
  },[])

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }


  return (
    <div className=" bg-gray-10/20">
      <MenuLateral menuView={menuView} setmenuView={setmenuView} />
      <div className={`childrenContainer ${menuView ? "" : "menuCloseContainer"} relative`}>
        {children}
      </div>
    </div>
  )
}
