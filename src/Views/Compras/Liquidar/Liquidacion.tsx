import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../Utils/UseContextProviders'
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'
import axios from '../../../Utils/BaseUrlAxio'
import { FormateoNumberInt } from '../../../Utils/Helpers'
import { ModalsLayout } from '../../../Components/Modals/ModalsLayout'
import { useAlert } from '../../../hooks/useAlert'
import { AgregarAlerta } from '../../../Utils/Helpers'

type PropsFormLine = {
    nameLabel1: string,
    nameLabel2: string,
    inputValue1: string | number | undefined,
    inputValue2: string | number | undefined,
    changeInputValue1?: React.Dispatch<React.SetStateAction<string | number>>,
    changeInputValue2?: React.Dispatch<React.SetStateAction<string | number>>,
    disabled1?: boolean
    disabled2?: boolean
}

type TDataBaseLiquidacion = {
    id: number,
    intValor: string
    strDescripcion: string
    strReferencia: string
    strUnidadMedida: string
    raggi: string
}

type TProps_Generos_Marcas = {
    id: string,
    descripcion: string
}

type TProps_Producto_HGI = {
    Descripcion: string
    clase: string
    dimension: string
    genero: string
    grupo: string
    linea: string
    marca: string
    material: string
    precio1: number
    precio2: number
    precio3: number
    precio4: number
    referencia: string
    tipo: string
    unidad_medida: string
    descripcion_corta: string
}

type TProps_Productos_DASH = {

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
    "intCantidadM": string,
    "strUnidadMedidaM": string,
    "strReferenciaM": string,
    "intCantidadPaca": number,
    "strMaterial": string,
    "strSexo": string,
    "strObservacion": string,
    "strMarca": string

}

type TProps_Unidades_HGI = {
    StrIdUnidad: string
}

type TProps_Productos_Liquidados = {
    id: number,
    strReferencia: string | number,
    strDescripcion: string | number,
    intPrecio1: number | string,
    intPrecio2: number | string,
    intPrecio3: number | string,
    intPrecio4: number | string,
    raggi: string | number,
    strUnidadMedida: string | number
}

const FormLine: React.FC<PropsFormLine> = ({
    nameLabel1, nameLabel2, inputValue1, inputValue2, changeInputValue1, changeInputValue2, disabled1 = false, disabled2 = false
}) => {
    return (
        <div className='flex justify-center gap-x-12 my-2'>
            <div className='w-full px-4 my-2'>
                <p className='py-2 font-bold text-slate-200'>{nameLabel1}</p>
                <input className={`rounded-xl w-full ${!disabled1 ? 'bg-white' : 'bg-gray-100/80'} outline-none border-2 border-gray-300 text-gray-800 p-2`} disabled={disabled1} type='text' value={typeof (inputValue1) == "number" ? FormateoNumberInt((inputValue1).toString()) : inputValue1} onChange={(e) => { changeInputValue1 && changeInputValue1(e.target.value) }} />
            </div>

            <div className='w-full px-4 my-2'>
                <p className='py-2 font-bold text-slate-200'>{nameLabel2}</p>
                <input className={`rounded-xl w-full ${!disabled2 ? 'bg-white' : 'bg-gray-100/80'} outline-none border-2 border-gray-300 text-gray-800 p-2`} disabled={disabled2} type='text' value={typeof (inputValue2) == "number" ? FormateoNumberInt((inputValue2).toString()) : inputValue2} onChange={(e) => { changeInputValue2 && changeInputValue2(e.target.value) }} />
            </div>
        </div>
    )
}

export const Liquidacion: React.FC = () => {
    //Hooks
    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const { alerts, createToast } = useAlert()

    //UseState
    const [datosLiquidar, setdatosLiquidar] = useState<TDataBaseLiquidacion[] | null>(null)
    const [listaGeneros, setlistaGeneros] = useState<TProps_Generos_Marcas[]>([] as TProps_Generos_Marcas[])
    const [listaMarcas, setlistaMarcas] = useState<TProps_Generos_Marcas[]>([] as TProps_Generos_Marcas[])
    const [listaUnidades, setlistaUnidades] = useState<TProps_Unidades_HGI[]>([] as TProps_Unidades_HGI[])
    const [errorsMessage, seterrorsMessage] = useState('')
    const [datosExistentesProducto, setdatosExistentesProducto] = useState<TProps_Producto_HGI | null>(null)
    const [datosLiquidarProducto, setdatosLiquidarProducto] = useState<TProps_Productos_DASH | null>(null)
    const [viewModalLiquidacion, setviewModalLiquidacion] = useState(false)
    const [listaProductosLiquidados, setlistaProductosLiquidados] = useState<TProps_Productos_Liquidados[]>([] as TProps_Productos_Liquidados[])

    //Estados para datos de liquidacion
    const [LReferencia, setLReferencia] = useState<string | number>('')
    const [LDescripcion, setLDescripcion] = useState<string | number>('')
    const [LDimension, setLDimension] = useState<string | number>('')
    const [LCxU, setLCxU] = useState<string | number>(0)
    const [LCantidadPaca, setLCantidadPaca] = useState<string | number>(0)
    const [LGenero, setLGenero] = useState<string | number>(0)
    const [LPrecio1, setLPrecio1] = useState<string | number>(0)
    const [LPrecio2, setLPrecio2] = useState<string | number>(0)
    const [LPrecio3, setLPrecio3] = useState<string | number>(0)
    const [LPrecio4, setLPrecio4] = useState<string | number>(0)
    const [LColor, setLColor] = useState<string | number>('')
    const [LCantidad, setLCantidad] = useState<string | number>(0)
    const [LMaterial, setLMaterial] = useState<string | number>('')
    const [LMarca, setLMarca] = useState<string | number>(0)
    const [LUnidades, setLUnidades] = useState<string | number>(0)
    const [Lobservacion, setLobservacion] = useState<string | number>('')

    //DATOS DE MODIFICACION
    const [Datos_Producto_Modificar, setDatos_Producto_Modificar] = useState<TProps_Productos_DASH>({} as TProps_Productos_DASH)
    const [viewModallModificar, setviewModallModificar] = useState(false)

    //CARGAR LOS DATOS INICIACILES DE LA LIQUIDACION 
    useEffect(() => {
        setMenuSelected(MenuSections.COMPRAS)
        setSubmenuSelected(SubMenuSections.LIQUIDAR)
        window.document.title = "Panel - Liquidación"
        async function main() {
            try {
                let data: any = await ConsultarDatosParaLiquidar()
                await Consultar_Generos_Productos()
                await Consultar_Marcas_Productos()
                await Consultar_Unidades()
                await Consultar_Productos_Liquidados()
                setdatosLiquidar(data)
            } catch (error) {
                seterrorsMessage("Ha ocurrido un error al cargar los datos")
            }
        }
        main()

    }, [])

    //BUSCAR LOS PRECIOS EN LA TABLA "tblpreciosempresa" CADA QUE PRECIO1 CAMBIA
    useEffect(() => {
        if (LPrecio1 !== 0 && LPrecio1.toString() !== "") {
            Cargar_Precios_Empresa()
        } else {
            setLPrecio2(0)
            setLPrecio3(0)
            setLPrecio4(0)
        }
    }, [LPrecio1])

    //CONSULTAR LOS DATOS EN LA TABLA "tbldocumentocompradetalle" LOS PRODUCTOS QUE TIENEN ESTADO 1
    const ConsultarDatosParaLiquidar = () => {
        return new Promise((resolve, reject) => {
            axios.get('/compras')
                .then((response) => {
                    if (response.status == 200) {
                        resolve(response.data.data)
                    } else {
                        resolve("Ha ocurrido un error")
                    }
                }).catch((err) => {
                    reject(err)
                })
        })
    }

    //FUNCION QUE SE ENCARGA DE CALCULAR EL VALOR ESTIMADO 2
    const CalcularEstimadoDos = (valor: number) => {
        return FormateoNumberInt((Math.round(valor * 0.1) + valor).toString())
    }

    //CONSULTAR LA LISTA DE GENEROS DEL HGI "TblProdParametro1"
    const Consultar_Generos_Productos = async () => {
        try {
            let data = await axios.get('/productos/generos')
            setlistaGeneros(data.data.generos)
        } catch (error) {
            console.error(error)
        }
    }

    //CONSULTAR LA LISTA DE MARCAS DEL HGI "TblProdParametro3"
    const Consultar_Marcas_Productos = async () => {
        try {
            let data = await axios.get('/productos/marcas')
            setlistaMarcas(data.data.marcas)
        } catch (error) {
            console.error(error)
        }
    }

    //CONSULTAR LA LISTA DE UNIDADES DEL HGI "TblUnidades"
    const Consultar_Unidades = async () => {
        try {
            let data = await axios.get('/productos/unidades')
            setlistaUnidades(data.data.unidades)
        } catch (error) {
            console.error(error)
        }
    }

    //CUANDO EN LA TABLA PRINCIPAL SE LE DA A UN PRODUCTO "LIQUIDAR" ESTA FUNCION SE ENCARGA DE TRAER LOS DATOS DEL PRODUCTO TANTO DE LA TABLA "tbldocumentocompradetalle" del DASH como de la tabla "TblProductos" del HGI
    const ConsultarInformacionProductoLiquidar = async (id: number, referencia: string) => {
        try {
            let data = await axios.post('/compras/liquidacion/producto', { id, referencia })
            if (data.data.hgi) {
                setdatosExistentesProducto(data.data.hgi)
            }
            setdatosLiquidarProducto(data.data.dash)

            setLDescripcion(data.data.hgi ? data.data.hgi.Descripcion : "")
            setLDimension(data.data.dash.strDimesion)
            setLCantidadPaca(data.data.dash.intCantidadPaca)
            setLobservacion(data.data.hgi ? data.data.hgi.descripcion_corta : "")
            //setLColor(data.data.dash.strColor)
        } catch (error) {
            console.error(error)
        }
    }

    //FUNCION QUE SE ENCARGA DE ACTUALIZAR EL PRODUCTO EN LA BASE DE DATOS EN "tbldocumentocompradetalle" CAMBIANDO LOS DATOS CORRESPONDIENTES Y SU ESTADO A 2
    const Liquidar = () => {
        axios.post('/compras/liquidar', {
            intIdDetalle: datosLiquidarProducto?.intIdDetalle,
            strDescripcion: LDescripcion,
            intPrecioUno: parseInt(LPrecio1.toString()) !== 0 ? parseInt(LPrecio1.toString()) : datosExistentesProducto?.precio1,
            intPrecioDos: parseInt(LPrecio2.toString()) !== 0 ? parseInt(LPrecio2.toString()) : datosExistentesProducto?.precio2,
            intPrecioTres: parseInt(LPrecio3.toString()) !== 0 ? parseInt(LPrecio3.toString()) : datosExistentesProducto?.precio3,
            intPrecioCuatro: parseInt(LPrecio4.toString()) !== 0 ? parseInt(LPrecio4.toString()) : datosExistentesProducto?.precio4,
            intPrecioCinco: 0,
            strReferencia: datosLiquidarProducto?.strReferencia,
            intCantidad: LCantidad == 0 ? datosLiquidarProducto?.intCantidad : parseInt(LCantidad.toString()),
            strUDM: "",
            intEstado: 2,
            strDimension: LDimension,
            intCxU: LCxU,
            strUnidadMedida: LUnidades,
            intCantidadPaca: parseInt(LCantidadPaca.toString()),
            strMaterial: LMaterial,
            strObservacion: Lobservacion,
            strSexo: LGenero,
            strMarca: LMarca,
            strColor: LColor,
        }).then((response) => {
            if (response.data.success) {
                setviewModalLiquidacion(false)
                Limpiar_Datos()
                setdatosLiquidar((prevData) => {
                    if (prevData === null || datosLiquidarProducto === null) {
                        return prevData;
                    }

                    return prevData.filter(item => item.id !== datosLiquidarProducto.intIdDetalle);
                });
                setlistaProductosLiquidados(response.data.liquidados)
                AgregarAlerta(createToast, "Liquidado correctamente", "success")

            }
        }).catch((err) => {
            console.error(err)
            AgregarAlerta(createToast, err, "danger")

        })
    }

    //FUNCION QUE BUSCA LOS PRECIOS de "tblpreciosempresa" EN BASE AL PRECIO 1
    const Cargar_Precios_Empresa = async () => {
        const porcentaje_p2 = 1.10
        const porcentaje_p3 = 1.20
        await axios.post('/compras/precios_empresa', {
            precio: typeof (LPrecio1) !== 'number' ? parseInt(LPrecio1) : LPrecio1
        }).then((response) => {
            if (response.data.data) {
                setLPrecio2(response.data.data.intPrecio2)
                setLPrecio3(response.data.data.intPrecio3)
            } else {
                setLPrecio2((prevValue) => {
                    const parsedLPrecio1 = typeof LPrecio1 === 'number' ? LPrecio1 : parseFloat(LPrecio1);
                    const nuevoValor = isNaN(parsedLPrecio1) ? prevValue : parsedLPrecio1 * porcentaje_p2;
                    return Math.round(parseFloat(nuevoValor.toString()));  // Aseguramos que el valor sea de tipo string
                });

                setLPrecio3((prevValue) => {
                    const parsedLPrecio1 = typeof LPrecio1 === 'number' ? LPrecio1 : parseFloat(LPrecio1);
                    const nuevoValor = isNaN(parsedLPrecio1) ? prevValue : parsedLPrecio1 * porcentaje_p3;
                    return Math.round(parseFloat(nuevoValor.toString())); // Aseguramos que el valor sea de tipo string
                });
            }

            setLPrecio4(typeof (LPrecio1) !== 'number' ? parseInt(LPrecio1) * 2 : LPrecio1 * 2)
        }).catch((err) => {
            console.error(err)
        })
    }

    //FUNCION QUE SE ENCARGA DE LIMPIAR LOS DATOS DEL MODAL
    const Limpiar_Datos = () => {
        setLDescripcion("")
        setLDimension("")
        setLCxU(0)
        setLCantidadPaca(0)
        setLPrecio1("")
        setLPrecio2(0)
        setLPrecio3(0)
        setLPrecio4(0)
        setLColor("")
        setLCantidad(0)
        setLMaterial("")
        setLGenero(0)
        setLMarca(0)
        setLUnidades(0)
        setLobservacion("")
        setdatosExistentesProducto(null)
    }

    //FUNCION QUE SE ENCARGA DE TRAER LOS PRODUCTOS CON ESTADO 2 ES DECIR PRODUCTOS QUE YA HAN SIDO LIQUIDADOS
    const Consultar_Productos_Liquidados = async () => {
        try {
            let { data: { data: data } } = await axios.get('/compras/liquidados')
            setlistaProductosLiquidados(data)
        } catch (error) {
            console.error(error)
        }
    }

    /* const Modificar_Producto_Liquidado = async (id: number) => {
        axios.put(`/compras/modificar_liquidado/${id}`) // Utiliza el id como parte de la URL
            .then(async (response) => {
                await ConsultarDatosParaLiquidar();
                setlistaProductosLiquidados((prevData) => {
                    if (prevData === null || listaProductosLiquidados === null || prevData === undefined) {
                        return prevData
                    }
                    return prevData.filter(item => item.id !== id)
                })

                setdatosLiquidar(response.data.data)
            })
            .catch((err) => {
                console.error(err);
            });
    } */

    //FUNCION PARA BUSCAR UNA REFERENCIA DENTRO DEL ARRAY DE PRODUCTOS POR LIQUIDAR
    const Buscar_Referencia = async (ref: string) => {
        let data: TDataBaseLiquidacion[] = await ConsultarDatosParaLiquidar() as TDataBaseLiquidacion[];

        if (ref !== "") {
            ref = ref.toLowerCase(); // Convertir ref a minúsculas
            let buscar: TDataBaseLiquidacion[] | undefined = data
                .filter((item: TDataBaseLiquidacion) =>
                    item.strReferencia.toLowerCase().includes(ref)
                );

            if (buscar !== undefined) {
                setdatosLiquidar(buscar);
            }
        } else {
            setdatosLiquidar(data);
        }
    }

    //FUNCION PARA BUSCAR REFERENCIAS DENTRO DEL ARRAY DEPRODUCTOS YA LIQUIDADOS
    const Buscar_Referencia_Liquidada = async (ref: string) => {
        let { data: { data: data } } = await axios.get('/compras/liquidados');

        if (ref !== "") {
            ref = ref.toLowerCase(); // Convertir ref a minúsculas
            let buscar: TProps_Productos_Liquidados[] | undefined = data
                .filter((item: TProps_Productos_Liquidados) =>
                    (item.strReferencia).toString().toLowerCase().includes(ref)
                );

            if (buscar !== undefined) {
                setlistaProductosLiquidados(buscar);
            }
        } else {
            setlistaProductosLiquidados(data);
        }
    }

    //FUNCION QUE SE ENCARGA DE RECOGER TODOS LOS DATOS REGISTRADOS EN EL DASH PARA MODIFICAR
    const Consultar_Informacion_Producto_Modificar = async (id: number) => {
        let data: any = await axios.get(`compras/modificar_liquidado/${id}`)
        let info: TProps_Productos_DASH = data.data.producto
        setDatos_Producto_Modificar(info)
        setLReferencia(info.strReferenciaM)
        setLDescripcion(info.strDescripcion)
        setLDimension(info.strDimesion)
        setLCxU(info.intCxU)
        setLCantidadPaca(info.intCantidadPaca)
        setLGenero(info.strSexo)
        setLPrecio1(info.intPrecio1)
        setLPrecio2(info.intPrecio2)
        setLPrecio3(info.intPrecio3)
        setLPrecio4(info.intPrecio4)
        setLColor(info.strColor)
        setLCantidad(info.intCantidadM)
        setLMaterial(info.strMaterial)
        setLMarca(info.strMarca)
        setLUnidades(info.strUnidadMedidaM)
        setLobservacion(info.strObservacion)

    }

    console.log(listaProductosLiquidados)
    const Actualizar_Producto_Liquidado = (id: number) => {
        
        axios.post('/compras/liquidar', {
            intIdDetalle: Datos_Producto_Modificar.intIdDetalle,
            strDescripcion: LDescripcion,
            intPrecioUno: parseInt(LPrecio1.toString()) !== 0 ? parseInt(LPrecio1.toString()) : Datos_Producto_Modificar.intPrecio1,
            intPrecioDos: parseInt(LPrecio2.toString()) !== 0 ? parseInt(LPrecio2.toString()) : Datos_Producto_Modificar.intPrecio2,
            intPrecioTres: parseInt(LPrecio3.toString()) !== 0 ? parseInt(LPrecio3.toString()) : Datos_Producto_Modificar.intPrecio3,
            intPrecioCuatro: parseInt(LPrecio4.toString()) !== 0 ? parseInt(LPrecio4.toString()) : Datos_Producto_Modificar.intPrecio4,
            intPrecioCinco: 0,
            strReferencia: LReferencia,
            intCantidad: LCantidad == 0 ? Datos_Producto_Modificar.intCantidadM : parseInt(LCantidad.toString()),
            strUDM: Datos_Producto_Modificar.strUnidadMedidaM,
            intEstado: 2,
            strDimension: LDimension,
            intCxU: LCxU,
            strUnidadMedida: LUnidades,
            intCantidadPaca: parseInt(LCantidadPaca.toString()),
            strMaterial: LMaterial,
            strObservacion: Lobservacion,
            strSexo: LGenero,
            strMarca: LMarca,
            strColor: LColor,
        }).then((response) => {
            if (response.data.success) {
                setviewModallModificar(false)
                setlistaProductosLiquidados((prevData) => {
                    return prevData.map((Producto) => (
                      Producto.id === id
                        ? {
                            id: Producto.id,
                            strReferencia: LReferencia,
                            strDescripcion: LDescripcion,
                            intPrecio1: LPrecio1,
                            intPrecio2: LPrecio2,
                            intPrecio3: LPrecio3,
                            intPrecio4: LPrecio4,
                            raggi: listaProductosLiquidados[0].raggi,
                            strUnidadMedida: LUnidades
                          }
                        : Producto
                    ));
                  });
                AgregarAlerta(createToast, "Actualizado correctamente", "success")
                Limpiar_Datos()

            }
        }).catch((err) => {
            console.error(err)
            AgregarAlerta(createToast, err, "danger")

        })


        Limpiar_Datos()
    }


    return (
        <AppLayout>
            <div className='relative max-h-screen overflow-y-scroll pb-5'>
                <section>
                    <div className='flex bg-[#2f3c87] text-white justify-center items-center py-2'>
                        <h1 className='text-2xl mt-2 italic font-bold'>Liquidar Productos</h1>
                    </div>
                    <div className='my-6'>
                        <input
                            type='text'
                            placeholder='Buscar Referencia...'
                            className='w-1/2 outline-none border-2 border-black rounded px-4 py-2'
                            onChange={(e) => { Buscar_Referencia(e.target.value) }}
                        />
                    </div>
                    <section>
                        <table className='w-full'>
                            <thead className='bg-[#75b628] text-white'>
                                <tr className='h-12 [&>th]:border-2 [&>th]:border-gray-700'>
                                    <th>#</th>
                                    <th>Referencia</th>
                                    <th>Descripcion</th>
                                    <th>Unidad Medida</th>
                                    <th>Raggi</th>
                                    <th>Estimado uno</th>
                                    <th>Estimado dos</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody className=' [&>tr]:border-b-2 [&>tr]:h-12 [&>tr>td]:border-x-2 [&>tr>td]:border-gray-300'>
                                {
                                    datosLiquidar?.map((producto, index) => (
                                        <tr className='[&>td]:text-center [&>td]:text-xl' key={index}>
                                            <td className='px-2'>{index + 1}</td>
                                            <td>{producto.strReferencia}</td>
                                            <td>{producto.strDescripcion}</td>
                                            <td>{producto.strUnidadMedida}</td>
                                            <td>{producto.raggi}</td>
                                            <td>$ {FormateoNumberInt(producto.intValor)}</td>
                                            <td>$ {CalcularEstimadoDos(parseFloat(producto.intValor))}</td>
                                            <td className='flex justify-center items-center h-12 w-full'>
                                                <span onClick={() => {
                                                    setviewModalLiquidacion(true)
                                                    ConsultarInformacionProductoLiquidar(producto.id, producto.strReferencia)
                                                }} className='bg-blue-500 px-2 py-1 rounded cursor-pointer hover:bg-blue-700 text-white'>Liquidar</span>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </section>
                </section>

                <hr className='my-6 border-4 border-gray-600' />

                <section>
                    <div className='flex bg-[#2f3c87] text-white justify-center items-center py-2'>
                        <h1 className='text-2xl mt-2 italic font-bold'>Productos liquidados</h1>
                    </div>
                    <div className='my-6'>
                        <input
                            type='text'
                            placeholder='Buscar Referencia...'
                            className='w-1/2 outline-none border-2 border-black rounded px-4 py-2'
                            onChange={(e) => { Buscar_Referencia_Liquidada(e.target.value) }}
                        />
                    </div>
                    <section>
                        <table className='w-full mt-6'>
                            <thead className='bg-[#75b628] text-white'>
                                <tr className='h-12 [&>th]:border-2 [&>th]:border-gray-700'>
                                    <th>#</th>
                                    <th>Referencia</th>
                                    <th>Descripcion</th>
                                    <th>Unidad Medida</th>
                                    <th>Raggi</th>
                                    <th>Precio 1</th>
                                    <th>precio 2</th>
                                    <th>precio 3</th>
                                    <th>precio 4</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody className=' [&>tr]:border-b-2 [&>tr]:h-12 [&>tr>td]:border-x-2 [&>tr>td]:border-gray-300'>
                                {
                                    listaProductosLiquidados?.map((producto, index) => (
                                        <tr className='[&>td]:text-center [&>td]:text-xl' key={index}>
                                            <td className='px-2'>{index + 1}</td>
                                            <td>{producto.strReferencia}</td>
                                            <td>{producto.strDescripcion}</td>
                                            <td>{producto.strUnidadMedida}</td>
                                            <td>{producto.raggi}</td>
                                            <td>$ {FormateoNumberInt((producto.intPrecio1).toString())}</td>
                                            <td>$ {FormateoNumberInt((producto.intPrecio2).toString())}</td>
                                            <td>$ {FormateoNumberInt((producto.intPrecio3).toString())}</td>
                                            <td>$ {FormateoNumberInt((producto.intPrecio4).toString())}</td>
                                            <td className='flex justify-center items-center h-12 w-full'>
                                                <span onClick={() => {
                                                    /* Modificar_Producto_Liquidado(producto.id) */
                                                    Consultar_Informacion_Producto_Modificar(producto.id)
                                                    setviewModallModificar(true)
                                                }} className='bg-lime-500 px-2 py-1 rounded cursor-pointer hover:bg-lime-700 text-white'>Modificar</span>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </section>
                </section>
            </div>

            {
                viewModalLiquidacion && (
                    <ModalsLayout CloseEvent={setviewModalLiquidacion}>
                        <section className={`text-xl flex h-full z-10 bg-gray-100 ${datosExistentesProducto == null ? "w-auto" : "w-full "}`}>
                            <div className={` overflow-y-scroll pb-2 bg-lime-800/80 text-white border-r-lime-400 border-r-2 flex-1`}>
                                <div className='bg-blue-500'>
                                    <h1 className='text-center text-2xl py-2 text-white italic font-bold'>DATOS PARA LIQUIDAR</h1>
                                </div>

                                <hr className='border-white' />
                                {
                                    datosLiquidarProducto !== null ? (
                                        <form>
                                            <div className=''>
                                                <FormLine
                                                    nameLabel1={"Referencia"}
                                                    nameLabel2={"precio 1"}
                                                    inputValue1={datosLiquidarProducto.strReferencia}
                                                    inputValue2={LPrecio1}
                                                    changeInputValue2={setLPrecio1}
                                                    disabled1={true}
                                                />
                                                <FormLine
                                                    nameLabel1={`Descripcion: ${datosLiquidarProducto.strDescripcion}`}
                                                    nameLabel2={"precio 2"}
                                                    inputValue1={LDescripcion}
                                                    inputValue2={LPrecio2}
                                                    changeInputValue1={setLDescripcion}
                                                    changeInputValue2={setLPrecio2}

                                                />
                                                <FormLine
                                                    nameLabel1={"Estimado Uno"}
                                                    nameLabel2={"precio 3"}
                                                    inputValue1={FormateoNumberInt(datosLiquidarProducto.intValor)}
                                                    inputValue2={LPrecio3}
                                                    changeInputValue2={setLPrecio3}
                                                    disabled1={true}
                                                />
                                                <FormLine
                                                    nameLabel1={"Estimado Dos"}
                                                    nameLabel2={"Precio 4"}
                                                    inputValue1={CalcularEstimadoDos(parseFloat(datosLiquidarProducto.intValor))}
                                                    inputValue2={LPrecio4}
                                                    changeInputValue2={setLPrecio4}
                                                    disabled1={true}
                                                />
                                                <div>
                                                    <div className='w-full px-4 my-2'>
                                                        <p className='py-2 font-bold text-slate-200'>Unidad de medida</p>
                                                        <select value={LUnidades} onChange={(e) => { setLUnidades(e.target.value) }} className='w-full px-2 py-2 rounded-lg outline-none border-gray-400 border-2 text-black'>
                                                            <option value={0} disabled className='text-gray-400 text-sm'>Seleccione UDM</option>
                                                            {
                                                                listaUnidades.map((unidad, index) => (
                                                                    <option key={index} value={unidad.StrIdUnidad}>{unidad.StrIdUnidad}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <FormLine
                                                    nameLabel1={"Dimension"}
                                                    nameLabel2={`Color`}
                                                    inputValue1={LDimension}
                                                    inputValue2={LColor}
                                                    changeInputValue1={setLDimension}
                                                    changeInputValue2={setLColor}
                                                />
                                                <FormLine
                                                    nameLabel1={`CxU`}
                                                    nameLabel2={`Cantidad: ${datosLiquidarProducto.intCantidad} / ${datosLiquidarProducto.strUnidadMedida}`}
                                                    inputValue1={LCxU}
                                                    inputValue2={LCantidad}
                                                    changeInputValue1={setLCxU}
                                                    changeInputValue2={setLCantidad}
                                                />
                                                <FormLine
                                                    nameLabel1={"Cantidad Paca"}
                                                    nameLabel2={`Material: ${datosLiquidarProducto.strMaterial}`}
                                                    inputValue1={LCantidadPaca}
                                                    inputValue2={LMaterial}
                                                    changeInputValue1={setLCantidadPaca}
                                                    changeInputValue2={setLMaterial}
                                                />

                                                <div className='flex justify-center gap-x-12 my-2'>
                                                    <div className='w-full px-4 my-2'>
                                                        <p className='py-2 font-bold text-slate-200'>Género</p>
                                                        <select value={LGenero} onChange={(e) => { setLGenero(e.target.value) }} className='w-full px-2 py-2 rounded-lg outline-none border-gray-400 border-2 text-black'>
                                                            <option value={0} disabled className='text-gray-400 text-sm'>Seleccione Genero</option>
                                                            {
                                                                listaGeneros.map((genero, index) => (
                                                                    <option key={index} value={genero.id} >{genero.descripcion}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    <div className='w-full px-4 my-2'>
                                                        <p className='py-2 font-bold text-slate-200'>Marca</p>
                                                        <select value={LMarca} onChange={(e) => { setLMarca(e.target.value) }} className='w-full px-2 py-2 rounded-lg outline-none border-gray-400 border-2 text-black'>
                                                            <option value={0} disabled className='text-gray-400 text-sm'>Seleccione Marca</option>
                                                            {
                                                                listaMarcas.map((marca, index) => (
                                                                    <option key={index} value={marca.id}>{marca.descripcion}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className='w-full px-4 my-4'>
                                                    <textarea value={Lobservacion} onChange={(e) => { setLobservacion(e.target.value) }} className='w-full h-20 outline-none resize-none text-black px-4 py-2 rounded' placeholder='Digite la observacion' />
                                                </div>

                                                <div className='px-4 flex justify-evenly pb-4'>
                                                    <button className='bg-lime-600 px-4 py-2 rounded hover:bg-lime-700' onClick={Liquidar}>Liquidar</button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setviewModalLiquidacion(false)
                                                            Limpiar_Datos()
                                                        }}
                                                        className='bg-red-400/80 px-4 py-2 rounded hover:bg-red-500/80'>Cerrar
                                                    </button>
                                                </div>

                                            </div>
                                        </form>
                                    ) : (
                                        <h1></h1>
                                    )
                                }
                            </div>

                            <div className={`${datosExistentesProducto == null && "hidden"} flex-1 overflow-y-scroll pb-2 bg-gray-600 text-white`}>
                                <div className='bg-[#2f3c87]'>
                                    <h1 className='text-center text-2xl py-2 text-white italic font-bold'>DATOS EXISTENTES</h1>
                                </div>

                                <hr className='border-white' />
                                {
                                    datosExistentesProducto !== null ? (
                                        <form>
                                            <div className='[&>div>div>input]:bg-white/80'>
                                                <FormLine
                                                    nameLabel1={"Referencia"}
                                                    nameLabel2={"precio 1"}
                                                    inputValue1={datosExistentesProducto.referencia}
                                                    inputValue2={FormateoNumberInt(`${datosExistentesProducto.precio1}`)}
                                                    disabled1={true}
                                                    disabled2={true}

                                                />
                                                <FormLine
                                                    nameLabel1={"Descripcion"}
                                                    nameLabel2={"precio 2"}
                                                    inputValue1={datosExistentesProducto.Descripcion}
                                                    inputValue2={FormateoNumberInt(`${datosExistentesProducto.precio2}`)}
                                                    disabled1={true}
                                                    disabled2={true}
                                                />
                                                <FormLine
                                                    nameLabel1={"precio 3"}
                                                    nameLabel2={"precio 4"}
                                                    inputValue1={FormateoNumberInt(`${datosExistentesProducto.precio3}`)}
                                                    inputValue2={FormateoNumberInt(`${datosExistentesProducto.precio4}`)}
                                                    disabled1={true}
                                                    disabled2={true}
                                                />
                                                <FormLine
                                                    nameLabel1={"Dimension"}
                                                    nameLabel2={"Unidad de Medida"}
                                                    inputValue1={datosExistentesProducto.dimension}
                                                    inputValue2={datosExistentesProducto.unidad_medida}
                                                    disabled1={true}
                                                    disabled2={true}
                                                />
                                                <FormLine
                                                    nameLabel1={"Material"}
                                                    nameLabel2={"Marca"}
                                                    inputValue1={datosExistentesProducto.material}
                                                    inputValue2={datosExistentesProducto.marca}
                                                    disabled1={true}
                                                    disabled2={true}
                                                />
                                                <FormLine
                                                    nameLabel1={"Género"}
                                                    nameLabel2={"linea"}
                                                    inputValue1={datosExistentesProducto.genero}
                                                    inputValue2={datosExistentesProducto.linea}
                                                    disabled1={true}
                                                    disabled2={true}
                                                />
                                                <FormLine
                                                    nameLabel1={"clase"}
                                                    nameLabel2={"Grupo"}
                                                    inputValue1={datosExistentesProducto.clase}
                                                    inputValue2={datosExistentesProducto.grupo}
                                                    disabled1={true}
                                                    disabled2={true}
                                                />
                                                <FormLine
                                                    nameLabel1={"Tipo"}
                                                    nameLabel2={"Observacion"}
                                                    inputValue1={datosExistentesProducto.tipo}
                                                    inputValue2={datosExistentesProducto.descripcion_corta}
                                                    disabled1={true}
                                                    disabled2={true}
                                                />
                                            </div>
                                        </form>
                                    ) : (
                                        <h1></h1>
                                    )
                                }

                            </div>
                        </section>
                    </ModalsLayout>
                )
            }
            {
                <h1>{errorsMessage}</h1>
            }
            {
                viewModallModificar && (
                    <ModalsLayout CloseEvent={setviewModallModificar}>
                        <section className={`text-xl flex h-full z-10 bg-gray-100 ${datosExistentesProducto == null ? "w-auto" : "w-full "}`}>
                            <div className={` overflow-y-scroll pb-2 bg-lime-800/80 text-white border-r-lime-400 border-r-2 flex-1`}>
                                <div className='bg-blue-500'>
                                    <h1 className='text-center text-2xl py-2 text-white italic font-bold'>DATOS PARA ACTUALIZAR</h1>
                                </div>

                                <hr className='border-white' />
                                {
                                    Datos_Producto_Modificar !== null ? (
                                        <div>
                                            <div className=''>
                                                <FormLine
                                                    nameLabel1={"Referencia"}
                                                    nameLabel2={"precio 1"}
                                                    inputValue1={LReferencia}
                                                    inputValue2={LPrecio1}
                                                    changeInputValue1={setLReferencia}
                                                    changeInputValue2={setLPrecio1}
                                                />
                                                <FormLine
                                                    nameLabel1={`Descripcion`}
                                                    nameLabel2={"precio 2"}
                                                    inputValue1={LDescripcion}
                                                    inputValue2={LPrecio2}
                                                    changeInputValue1={setLDescripcion}
                                                    changeInputValue2={setLPrecio2}

                                                />
                                                <FormLine
                                                    nameLabel1={"Estimado Uno"}
                                                    nameLabel2={"precio 3"}
                                                    inputValue1={FormateoNumberInt(Datos_Producto_Modificar.intValor)}
                                                    inputValue2={LPrecio3}
                                                    changeInputValue2={setLPrecio3}
                                                    disabled1={true}
                                                />
                                                <FormLine
                                                    nameLabel1={"Estimado Dos"}
                                                    nameLabel2={"Precio 4"}
                                                    inputValue1={CalcularEstimadoDos(parseFloat(Datos_Producto_Modificar.intValor))}
                                                    inputValue2={LPrecio4}
                                                    changeInputValue2={setLPrecio4}
                                                    disabled1={true}
                                                />
                                                <div>
                                                    <div className='w-full px-4 my-2'>
                                                        <p className='py-2 font-bold text-slate-200'>Unidad de medida</p>
                                                        <select value={LUnidades} onChange={(e) => { setLUnidades(e.target.value) }} className='w-full px-2 py-2 rounded-lg outline-none border-gray-400 border-2 text-black'>
                                                            <option value={0} disabled className='text-gray-400 text-sm'>Seleccione UDM</option>
                                                            {
                                                                listaUnidades.map((unidad, index) => (
                                                                    <option key={index} value={unidad.StrIdUnidad}>{unidad.StrIdUnidad}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <FormLine
                                                    nameLabel1={"Dimension"}
                                                    nameLabel2={`Color`}
                                                    inputValue1={LDimension}
                                                    inputValue2={LColor}
                                                    changeInputValue1={setLDimension}
                                                    changeInputValue2={setLColor}
                                                />
                                                <FormLine
                                                    nameLabel1={`CxU`}
                                                    nameLabel2={`Cantidad : ${Datos_Producto_Modificar.intCantidad} / ${Datos_Producto_Modificar.strUnidadMedida}`}
                                                    inputValue1={LCxU}
                                                    inputValue2={LCantidad}
                                                    changeInputValue1={setLCxU}
                                                    changeInputValue2={setLCantidad}
                                                />
                                                <FormLine
                                                    nameLabel1={"Cantidad Paca"}
                                                    nameLabel2={`Material`}
                                                    inputValue1={LCantidadPaca}
                                                    inputValue2={LMaterial}
                                                    changeInputValue1={setLCantidadPaca}
                                                    changeInputValue2={setLMaterial}
                                                />
                                                <div className='flex justify-center gap-x-12 my-2'>
                                                    <div className='w-full px-4 my-2'>
                                                        <p className='py-2 font-bold text-slate-200'>Género</p>
                                                        <select value={LGenero} onChange={(e) => { setLGenero(e.target.value) }} className='w-full px-2 py-2 rounded-lg outline-none border-gray-400 border-2 text-black'>
                                                            <option value={0} disabled className='text-gray-400 text-sm'>Seleccione Genero</option>
                                                            {
                                                                listaGeneros.map((genero, index) => (
                                                                    <option key={index} value={genero.id} >{genero.descripcion}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    <div className='w-full px-4 my-2'>
                                                        <p className='py-2 font-bold text-slate-200'>Marca</p>
                                                        <select value={LMarca} onChange={(e) => { setLMarca(e.target.value) }} className='w-full px-2 py-2 rounded-lg outline-none border-gray-400 border-2 text-black'>
                                                            <option value={0} disabled className='text-gray-400 text-sm'>Seleccione Marca</option>
                                                            {
                                                                listaMarcas.map((marca, index) => (
                                                                    <option key={index} value={marca.id}>{marca.descripcion}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className='w-full px-4 my-4'>
                                                    <textarea value={Lobservacion} onChange={(e) => { setLobservacion(e.target.value) }} className='w-full h-20 outline-none resize-none text-black px-4 py-2 rounded' placeholder='Digite la observacion' />
                                                </div>

                                                <div className='px-4 flex justify-evenly pb-4'>
                                                    <button className='bg-lime-600 px-4 py-2 rounded hover:bg-lime-700' onClick={()=>{Actualizar_Producto_Liquidado(Datos_Producto_Modificar.intIdDetalle)}}>Actualizar</button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setviewModalLiquidacion(false)
                                                            Limpiar_Datos()
                                                        }}
                                                        className='bg-red-400/80 px-4 py-2 rounded hover:bg-red-500/80'>Cerrar
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    ) : (
                                        <h1></h1>
                                    )
                                }
                            </div>
                        </section>

                    </ModalsLayout>
                )
            }
            {alerts}
        </AppLayout>
    )
}
