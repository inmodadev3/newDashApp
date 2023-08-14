export interface IDataUser {
    idLogin: number;
    intIdCompania: number;
    strClave: string;
    strIdVendedor: string;
    strNombreEmpleado: string;
    strUsuario: string;
    token: string;
}

export interface IArrayProductos {
    "referencia": string,
    "descripcion": string,
    "UM": string,
    "cantxEmpaque": string | null,
    "Ubicacion": string,
    "medida": string,
    "sexo": string,
    "Material": string,
    "Marca": string,
    "precio": number,
    "productoImg": string | null,
    "saldoInv": string | null
}