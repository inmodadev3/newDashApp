import * as XLSX from 'xlsx';

export const Excel_Formatos = (data: any,bookName:string,documentName:string) => {
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

export const Excel_Pedidos = (data: any[], bookName: string, documentName: string) => {
    // Crear una matriz de encabezados
    const headers = ['StrSerie', 'StrProducto', 'StrColor', 'intCantidadDoc', 'intValorUnitario', 'intValorTotal'];

    // Combinar encabezados con datos
    const dataArray = [headers, ...data.map(item =>
        [item.StrSerie, item.StrProducto, item.StrColor, item.intCantidadDoc, item.intValorUnitario, item.intValorTotal]
    )];

    const ws = XLSX.utils.aoa_to_sheet(dataArray);

    const cellStyle = {
        font: { size: 12, bold: true },
        alignment: { vertical: 'center', horizontal: 'center' },
        fill: { fgColor: { rgb: 'D4FF1B' } },
        border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
        },
    };

    // Aplicar estilo a las celdas de encabezado
    headers.forEach((header, index) => {
        console.log(header)
        const cell = XLSX.utils.encode_cell({ r: 0, c: index });
        ws[cell].s = cellStyle;
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, bookName);

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName}.xlsx`;
    a.click();

    URL.revokeObjectURL(url);
}
