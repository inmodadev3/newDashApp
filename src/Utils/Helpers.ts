import NotFound from '../../assets/img/img-no-disponible.jpg'
import * as XLSX from 'xlsx';


export const URLAPI = 'http://192.168.1.174:8083/api/v1'
export const URLIMAGENESPRODUCTOS = 'http://10.10.10.128/ownCloud/fotos_nube/FOTOS%20%20POR%20SECCION%20CON%20PRECIO'
export const ImagenNotFound = NotFound

export const FormateoNumberInt = (num: string) => {
    try {
        return parseFloat(num).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } catch (error) {
        //// console.log(err)
    }
}

export const ExportarExcel = (data: any,bookName:string,documentName:string) => {
    const ws = XLSX.utils.aoa_to_sheet(data);

    const cellStyle = {
        font: { size: 12, bold: true }, // Tamaño de letra y negrita
        alignment: { vertical: 'center', horizontal: 'center' }, // Alinear texto al centro vertical y horizontalmente
        fill: { fgColor: { rgb: 'D4FF1B' } }, // Color de fondo (en este caso, rojo)
        border: {
            top: { style: 'thin', color: { rgb: '000000' } }, // Borde superior con línea delgada y color negro
            bottom: { style: 'thin', color: { rgb: '000000' } }, // Borde inferior con línea delgada y color negro
            left: { style: 'thin', color: { rgb: '000000' } }, // Borde izquierdo con línea delgada y color negro
            right: { style: 'thin', color: { rgb: '000000' } }, // Borde derecho con línea delgada y color negro
        },
    };

    const cellA1 = XLSX.utils.encode_cell({ r: 0, c: 0 });
    ws[cellA1].s = cellStyle;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, bookName);

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName}.xlsx`;
    a.click();

    URL.revokeObjectURL(url)
}

export const AgregarAlerta = (createToast:any,texto:string,variante: "success" | "danger" | "warning") =>{
    createToast({
        text:texto,
        variant:variante
    })
}




