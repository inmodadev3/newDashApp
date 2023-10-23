import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from './Utils/BaseUrlAxio'

interface IDataUser {
  idLogin: number,
  intIdCompania: number,
  strClave: string,
  strIdVendedor: string,
  strNombreEmpleado: string,
  strUsuario: string,
  token:string
}

const App = () => {

  let userData :string | null = localStorage.getItem('dataUser')
  let userInfo :IDataUser | null = null
  let navigate = useNavigate()
  useEffect(() => {
    if(userData){
      userInfo = JSON.parse(userData)
      axios.get(`/usuarios`,{
        headers:{
          Authorization:`Bearer ${userInfo?.token}`
        }
      }).then((response)=>{
        if(response.data.data === "ok"){
          navigate('/home')
        }
      }).catch(()=>{
        navigate('/login')
      })
      
    }else{
      navigate('/login')
    }
  }, [])
  

  return (
    <h1>Hola mundo</h1>
  )
}

export default App
