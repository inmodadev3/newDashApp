import { useState } from 'react'
import './stylesLogin.css'
import axios from '../../Utils/BaseUrlAxio.ts'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/img/INMODA.png'

interface IUserInfoData {
    data: IDataResponseUser,
    token: string
}

interface IDataResponseUser {
    idLogin: number,
    intIdCompania: number,
    strClave: string,
    strIdVendedor: string,
    strNombreEmpleado: string,
    strUsuario: string,
}



export const Login = () => {

    const [usuarioFocused, setusuarioFocused] = useState(false)
    const [passwordFocused, setpasswordFocused] = useState(false)

    const [usuario, setusuario] = useState('')
    const [password, setpassword] = useState('')

    let navigate = useNavigate()

    const validarBlur = () => {
        if (usuario.trim() !== '') {
            setusuarioFocused(true)
        } else {
            setusuarioFocused(false)
        }

        if (password.trim() !== '') {
            setpasswordFocused(true)
        } else {
            setpasswordFocused(false)
        }
    }


    const LoginAction = () => {
        try {
            if (usuario.trim() !== "" && password.trim() !== "") {
                axios.post(`/usuarios/login`, {
                    strUsuario: usuario.toUpperCase(),
                    strClave: password.toUpperCase()
                }).then((response) => {
                    if (response.status === 200) {
                        let data: IUserInfoData = response.data.data
                        let token: string = response.data.token
                        let user: IUserInfoData = { ...data, token }
                        localStorage.setItem('dataUser', JSON.stringify(user))
                        navigate('/')
                    } else {
                        console.log(response)
                    }
                }).catch((err) => {
                    if (err.response.status === 404) {
                        alert("Usuario o contraseña incorrectos")
                    }
                })
            } else {
                alert("Usuario y contraseña requeridos")
            }
        } catch (error) {
            console.error(error)
            alert("Ha ocurrido un error " + error)
        }

    }

    return (
        <div className=" w-screen h-screen flex items-center justify-center">

            <div className='widthContainer'>
                <div className='border-2 border-sky-900 flex flex-col items-center'>
                    <div className='loginFormHeader'>
                        <span>DASHBOARD</span>
                    </div>
                    <div style={{ width: '50%', display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                        <img src={logo} alt='logoInmoda' width={'250px'} />
                    </div>
                    <div className='loginInputContainer'>
                        <label>
                            <div className={`loginTxtLabel ${usuarioFocused && 'loginTxtLabel--focus'}`}>
                                <span>{usuarioFocused ? "Usuario" : "Digite un usuario"}</span>
                            </div>
                            <input
                                type='text'
                                className={`loginInput ${usuarioFocused && 'loginFocus'}`}
                                onFocus={() => setusuarioFocused(true)}
                                onBlur={validarBlur}
                                value={usuario}
                                onChange={(e) => { setusuario(e.target.value) }}
                                onKeyUp={(e) => {
                                    if (e.keyCode === 13) {
                                        LoginAction()
                                    }
                                }}
                            />
                        </label>
                    </div>
                    <div className='loginInputContainer'>
                        <label>
                            <div className={`loginTxtLabel ${passwordFocused && 'loginTxtLabel--focus'}`}>
                                <span>{passwordFocused ? "Contraseña" : "Digite una contraseña"}</span>
                            </div>
                            <input
                                type='password'
                                className={`loginInput ${passwordFocused && 'loginFocus'}`}
                                onFocus={() => setpasswordFocused(true)}
                                onBlur={validarBlur}
                                value={password}
                                onChange={(e) => { setpassword(e.target.value) }}
                                onKeyUp={(e) => {
                                    if (e.keyCode === 13) {
                                        LoginAction()
                                    }
                                }}
                            />
                        </label>
                    </div>
                    <button className='bntLogin' onClick={LoginAction}>Ingresar</button>
                </div>
            </div>
        </div>
    )
}

