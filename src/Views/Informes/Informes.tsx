import React, { useState, useEffect, useContext } from 'react'
import { AppLayout } from '../../Components/AppLayout/AppLayout'
import { IoDocumentTextOutline } from "react-icons/io5";
import axios from '../../Utils/BaseUrlAxio';
import { MenuSelectedContext } from '../../Utils/UseContextProviders';
import { MenuSections } from '../../Components/MenuLateral/MenuSections';
import { FormateoNumberInt } from '../../Utils/Helpers';
import { MdAttachMoney } from 'react-icons/md';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';


type TVentas = {
    dia: number,
    suma_ventas_con_iva: number
}

type TVentas_Empleados = {
    StrNombre: number,
    Total: number
}

type TClientesTop = {
    StrNombre: number,
    TotalComprasTercero: number
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const optionsLine = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Ventas del mes Por dia',
        },
    },
};

const optionsBar = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Ventas de empleados',
        },
    },
};

const optionsBar2 = {
    indexAxis: 'y' as const,
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            position: 'right' as const,
        },
        title: {
            display: true,
            text: 'Top clientes',
        },
    },
};


export const Informes: React.FC = () => {

    const { setMenuSelected } = useContext(MenuSelectedContext)

    //DATOS GENERALES DE LOS PEDIDOS
    const [totalPedidos, setTotalPedidos] = useState(0)
    const [totalValorPedidos, setTotalValorPedidos] = useState(0)

    //FILTROS DE FECHAS
    const [mes, setmes] = useState(1)
    const [anio, setanio] = useState(2023)
    const [aniosSelect, setaniosSelect] = useState<string>('')
    const [maxDate, setmaxDate] = useState('')

    //DATOS DE COMPRAR EN EL MES
    const [ventas, setventas] = useState<TVentas[]>([] as TVentas[])
    const [ventas_empleados, setventas_empleados] = useState<TVentas_Empleados[]>([] as TVentas_Empleados[])
    const [clientesTop, setclientesTop] = useState<TClientesTop[]>([] as TClientesTop[])


    useEffect(() => {
        setMenuSelected(MenuSections.INFORMES)
        CalcularAnios()
    }, [])

    useEffect(() => {
        Consultar_datos_generales_mes()
        ObtenerVentasXDias()
        ObtenerVentasEmpleados()
        ObtenerTopClientes()
    }, [mes, anio])

    const Consultar_datos_generales_mes = async () => {
        try {
            const datos = await axios.post('/informes/pedidos', {
                "mes": mes,
                "anio": anio
            })

            const response = datos.data.data[0]
            setTotalPedidos(response.TotalPedidos)
            setTotalValorPedidos(response.TotalValorPedidos)

        } catch (error) {
            console.error(error)
        }
    }

    const CalcularAnios = () => {
        let fechaActual = new Date();

        // Obtén el año y el mes actual
        let year = fechaActual.getFullYear();
        let month = fechaActual.getMonth() + 1; // Se agrega 1 ya que los meses en JavaScript van de 0 a 11

        // Formatea el año y el mes con ceros a la izquierda si es necesario
        let formattedMonth = month < 10 ? '0' + month : month;
        setmes(month)
        setanio(year)
        setmaxDate(year + '-' + formattedMonth)
        setaniosSelect(year + '-' + formattedMonth)
    }

    const handleChangeDateSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fecha_string = e.target.value;

        if (fecha_string) {
            const fecha = new Date(fecha_string + '-01');


            fecha.setMonth(fecha.getMonth() + 1);
            fecha.setDate(fecha.getDate() - 1);

            const mes = fecha.getMonth() + 1;

            const anio = fecha.getFullYear();

            const formattedMonth = mes < 10 ? '0' + mes : mes.toString();

            setmes(mes);
            setanio(anio);
            setaniosSelect(`${anio}-${formattedMonth}`);
        } else {
            console.error("La fecha proporcionada es undefined o null.");
        }
    }

    const ObtenerVentasXDias = async () => {
        try {
            const datos = await axios.post('/informes/dias', {
                "mes": mes,
                "anio": anio
            })

            const response = datos.data.ventas
            setventas(response)
        } catch (error) {
            console.error(error)
        }
    }

    const ObtenerVentasEmpleados = async () => {
        try {
            const datos = await axios.post('/informes/empleados', {
                "mes": mes,
                "anio": anio
            })

            const response = datos.data.ventas
            setventas_empleados(response)
        } catch (error) {
            console.error(error)
        }
    }

    const ObtenerTopClientes = async () => {
        try {
            const datos = await axios.post('/informes/clientes', {
                "mes": mes,
                "anio": anio
            })

            const response = datos.data.clientes
            setclientesTop(response)
        } catch (error) {
            console.error(error)
        }
    }

    const dataLine = {
        labels: ventas.map((dataPoint) => dataPoint.dia),
        datasets: [
            {
                label: 'Suma Ventas con IVA',
                data: ventas.map((venta) => venta.suma_ventas_con_iva),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const dataBar = {
        labels: ventas_empleados.map((ventas) => ventas.StrNombre),
        datasets: [
            {
                label: 'Ventas empleados',
                data: ventas_empleados.map((venta) => venta.Total),
                backgroundColor: ventas_empleados.map((_, index) => (index % 2 === 0 ? 'rgb(75, 192, 192)' : 'gray')),
            },
        ],
    };

    const dataBar2 = {
        labels: clientesTop.map((cliente) => cliente.StrNombre),
        datasets: [
            {
                label: 'Top clientes',
                data: clientesTop.map((cliente) => cliente.TotalComprasTercero),
                backgroundColor: clientesTop.map((_, index) => (index % 2 === 0 ? 'rgb(75, 192, 192)' : 'gray')),
            },
        ],
    };


    return (
        <AppLayout>
            <div className='mt-12 flex flex-col md:flex-row gap-8'>
                <article className='flex items-center gap-6 bg-slate-100 px-4 py-2 rounded text-slate-700'>
                    <IoDocumentTextOutline size={25} />
                    <p >
                        Pedidos
                        <span className='text-blue-700 text-lg px-4'> {totalPedidos}</span>
                    </p>
                </article>

                <article className='flex items-center gap-6 bg-slate-100 px-4 py-2 rounded text-slate-700'>
                    <MdAttachMoney size={25} />
                    <p >
                        Total
                        <span className='text-blue-700 text-lg px-4'> {totalValorPedidos ? FormateoNumberInt(totalValorPedidos.toFixed(0)) : 0}</span>
                    </p>
                </article>
            </div>

            <div className='mt-12 bg-slate-100 px-4 py-4 rounded flex gap-12 items-center shadow'>
                <p>Filtro de fechas: </p>
                <div>
                    <input
                        type='month'
                        max={maxDate}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        value={aniosSelect}
                        onChange={handleChangeDateSelected}
                    />
                </div>
            </div>

            <div className='mt-12 flex gap-7 flex-col md:flex-row'>
                <div className='w-full bg-slate-100 h-auto px-4 py-2 shadow-md'>
                    <Line
                        options={optionsLine}
                        data={dataLine}
                    />
                </div>

                <div className='w-full bg-slate-100 h-auto px-4 py-2 shadow-md'>
                    <Bar
                        options={optionsBar}
                        data={dataBar}
                    />
                </div>
            </div>

            <div className='py-12 flex'>
                <div className='w-1/2 bg-slate-100 h-auto px-4 py-2 shadow-md'>
                    <Bar
                        options={optionsBar2}
                        data={dataBar2}
                    />
                </div>
            </div>
        </AppLayout>
    )
}
