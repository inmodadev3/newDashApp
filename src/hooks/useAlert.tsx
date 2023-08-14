import {useState,ReactNode} from 'react'
import { Alert } from '../Components/Alerts/Alert';


type ToastFunction = (options: ToastType) => void;
type ToastType = {
    text:string,
    variant: "success" | "danger" | "warning";
}

type UseAlertReturnType = {
  alerts: ReactNode;
  createToast: ToastFunction;
};

export const useAlert = ():UseAlertReturnType => {
  const [listAlerts, setAlerts] = useState<ToastType[]>([])


  const createToast = (options:ToastType) =>{
    setAlerts([...listAlerts,options]);
    setTimeout(() => {
        setAlerts(list => list.slice(1))
    }, 3000);
  }

  const alerts = (
    <div className='fixed top-0 right-2 z-[1000]'>
        {listAlerts.map((alert,index)=>(
            <Alert variant={alert.variant} key={index}>{alert.text}</Alert>
        ))}
    </div>
  )

  return {
    alerts,
    createToast
  }
}
