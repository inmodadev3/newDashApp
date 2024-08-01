import NotFound from '../../assets/img/img-no-disponible.jpg'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

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

export const fechaParseada = (fecha: Date | string): string => {
    if (fecha) {
        // Parsea la fecha en formato ISO
        let fechaString = fecha.toString().substring(0, 10)
        const fechaISO = parseISO(fechaString);

        console.log(fechaISO)
        // Formatea la fecha en el formato deseado (mes y día de la semana)
        if (fecha.toString().length < 25) {
            const fechaFormateada = format(fechaISO, 'eee d MMM yyyy', { locale: es }).toUpperCase();
            return fechaFormateada;
        } else {
            return ""
        }
    } else {
        return ""
    }


}

export const AgregarAlerta = (createToast: any, texto: string, variante: "success" | "danger" | "warning") => {
    createToast({
        text: texto,
        variant: variante
    })
}




