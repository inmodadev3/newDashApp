import * as XLSX from 'xlsx';

type TArrCompras = {
    "strCaja": string,
    "strReferencia": string,
    "intCxU": number,
    "strUnidadMedida": string,
    "intValor": string,
    "intIdDocumento": number,
    "strDescripcion": string,
    "intEstado": number,
    "intIdDetalle": number,
    "intPrecio1": number,
    "intPrecio2": number,
    "intPrecio3": number,
    "intPrecio4": number,
    "intPrecio5": number,
    "intEstimadoUno": number,
    "intEstimadoDos": number,
    "strDimesion": string,
    "strColor": string,
    "intCantidad": number,
    "intCantidadM": number,
    "strUnidadMedidaM": string,
    "strReferenciaM": string,
    "intCantidadPaca": number,
    "strMaterial": string,
    "strSexo": string,
    "strObservacion": string,
    "strMarca": string
}

export const Excel_Formatos = (data: any, bookName: string, documentName: string) => {
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

export const Excel_Compras = (data: TArrCompras[], documentName: string, importacion: string) => {
    // Crear una matriz de encabezados
    const headers = [
        'Str Id Producto',
        'Str Descripcion',
        'Strauxiliar',
        'Str Linea',
        'Str Grupo',
        'Str Clase',
        'Str Tipo',
        'Str Unidad',
        'Str Und Compra',
        'Str Moneda',
        'Str Proveedor',
        'Int Precio1',
        'Int Precio2',
        'Int Precio3',
        'Int Precio4',
        'Int Precio5',
        'Int Precio6',
        'Int Precio7',
        'Int Precio8',
        'Int Imp Consumo',
        'Int Kardex',
        'Int Man Lote',
        'Int Iva',
        'Int Retencion',
        'Int Impuesto1',
        'Int Ica',
        'Int Vigente',
        'Int Marcado',
        'Int AIU',
        'Str Param1',
        'Str Param3',
        'Str Orden',
        'Str PParametro1',
        'Str PParametro2',
        'Str PParametro3',
        'Str DescripcionCorta'
    ];

    const headersCantidad = [
        'Str Id Producto',
        'intCantidad',
        'udm',
        'intCantidadOriginal',
        'udmOriginal'
    ]

    // Combinar encabezados con datos
    const dataProductos = [headers, ...data.map(item =>
        [
            (item.strReferenciaM !== "" && item.strReferenciaM !== null) ? item.strReferenciaM : item.strReferencia,
            item.strDescripcion,
            item.intCxU,
            '0',
            '0',
            '0',
            '0',
            item.strUnidadMedidaM,
            item.strUnidadMedidaM,
            '01',
            '0',
            item.intPrecio1,
            item.intPrecio2,
            item.intPrecio3,
            item.intPrecio4,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            1,
            0,
            0,
            1,
            0,
            0,
            importacion,
            item.strDimesion,
            1,
            item.strSexo,
            item.strMaterial,
            item.strMarca,
            item.strObservacion
        ]
    )];


    const dataCantidades = [headersCantidad, ...data.map(item =>
        [
            (item.strReferenciaM !== "" && item.strReferenciaM !== null) ? item.strReferenciaM : item.strReferencia,
            item.intCantidadM,
            item.strUnidadMedidaM,
            item.intCantidad,
            item.strUnidadMedida
        ])]

    const ws = XLSX.utils.aoa_to_sheet(dataProductos);
    const ws2 = XLSX.utils.aoa_to_sheet(dataCantidades);


    const cellStyle = {
        font: { size: 11, bold: true },
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
    headers.forEach((_, index) => {
        const cell = XLSX.utils.encode_cell({ r: 0, c: index });
        ws[cell].s = cellStyle;
    });

    headersCantidad.forEach((_, index) => {
        const cell = XLSX.utils.encode_cell({ r: 0, c: index });
        ws[cell].s = cellStyle;
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TblProductos');
    XLSX.utils.book_append_sheet(wb, ws2, 'cantidades');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/octet-stream' })

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName}.xlsx`;
    a.click();

    URL.revokeObjectURL(url);
}
