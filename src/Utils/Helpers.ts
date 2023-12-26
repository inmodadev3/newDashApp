import NotFound from '../../assets/img/img-no-disponible.jpg'

export const URLAPI = 'https://panel.inmodafantasy.com.co:8083/api'
export const URLAPIPruebas = 'https://localhost:8083/api'
export const URLIMAGENESPRODUCTOS = import.meta.env.VITE_HTTPSURLIMAGENES || '/owncloud'
export const ImagenNotFound = NotFound

export const FormateoNumberInt = (num: string): string => {
    try {
        return parseFloat(num).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } catch (error) {
        throw new Error("Ha ocurrido un error")
    }
}

export const quitarAcentos = (texto: string): string => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}; 

export const AgregarAlerta = (createToast:any,texto:string,variante: "success" | "danger" | "warning") =>{
    createToast({
        text:texto,
        variant:variante
    })
}




