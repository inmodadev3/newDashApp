import NotFound from '../../assets/img/img-no-disponible.jpg'

export const URLAPI = 'https://panel.inmodafantasy.com.co:8083/api'
export const URLIMAGENESPRODUCTOS = import.meta.env.VITE_HTTPSURLIMAGENES || '/owncloud'
export const ImagenNotFound = NotFound

export const FormateoNumberInt = (num: string) => {
    try {
        return parseFloat(num).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } catch (error) {
        //// console.log(err)
    }
}

export const AgregarAlerta = (createToast:any,texto:string,variante: "success" | "danger" | "warning") =>{
    createToast({
        text:texto,
        variant:variante
    })
}




