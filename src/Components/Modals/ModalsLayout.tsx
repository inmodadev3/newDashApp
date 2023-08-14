import React, { ReactElement } from 'react'
import './stylesModalsLayour.css'

type ModalProps = {
    children:ReactElement
    CloseEvent:React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalsLayout:React.FC<ModalProps> = ({children,CloseEvent}) => {
  return (
    <div className='ModalContainer '>
        <div className='ModalBlur ' onClick={()=>{CloseEvent(false)}}></div>
        {children}
    </div>
  )
}
