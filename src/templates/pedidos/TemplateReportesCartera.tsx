import React from 'react'
import { Document, Page, Text, View, StyleSheet, Line, Svg } from '@react-pdf/renderer';
import { FormateoNumberInt } from '../../Utils/Helpers';
import moment from 'moment';
import { PropsReportes } from '../../Views/pdfs/pedidos/ReportesDropiPDF';

interface IDatosPropsTemplatePedidos {
    datos: PropsReportes[]
}

export const TemplateReportesCartera: React.FC<IDatosPropsTemplatePedidos> = ({ datos }) => {


    const fecha = new Date().toISOString()

    return (
        <Document>
            <Page size={'LETTER'} style={styles.page}>
                <View style={styles.titleContainer}>
                    <View style={styles.section}>
                        <Text style={{ fontSize: 14 }}>IN MODA FANTASY S.A.S</Text>
                        <Text style={{ fontSize: 9 }}>604 5124129</Text>
                    </View>
                    <View style={[styles.section, { alignItems: 'flex-end' }]}>
                        <Text style={[styles.subtitulo, { fontSize: 10 }]}>
                            <Text style={styles.texto}>{moment.utc(fecha).local().format('DD-MM-YYYY')}</Text>
                        </Text>
                    </View>

                </View>
                <Svg height={2}>
                    <Line
                        x1="15"
                        y1="0"
                        x2="600"
                        y2="0"
                        strokeWidth={2}
                        stroke="#1B355D"
                    />
                </Svg>

                <Svg height={2}>
                    <Line
                        x1="15"
                        y1="0"
                        x2="600"
                        y2="0"
                        strokeWidth={2}
                        stroke="#1B355D"
                    />
                </Svg>
                <View style={styles.subtitlesContainer}>
                    <Text style={[styles.tableHeader, styles.lblDocumento]}>Documento</Text>
                    <Text style={[styles.tableHeader, styles.lblReferencia]}>Fecha</Text>
                    <Text style={[styles.tableHeader, styles.lblDescripcion]}>Cliente</Text>
                    <Text style={[styles.tableHeader, styles.lblEstilo]}>Valor</Text>
                    <Text style={[styles.tableHeader, styles.lblVendedor]}>Vendedor</Text>
                </View>
                <View style={styles.bodyContainer}>
                    {
                        datos.map((item, index) => {
                            return (
                                <View style={styles.rowContainer} key={index}>
                                    <Text style={[styles.tableBody, styles.lblDocumento]}>{item.intIdPedido}</Text>
                                    <Text style={[styles.tableBody, styles.lblReferencia]}>{moment.utc(item.dtFechaEnvio).local().format('YYYY-MM-DD')}</Text>
                                    <Text style={[styles.tableBody, styles.lblDescripcion]}>{item.strNombCliente}</Text>
                                    <Text style={[styles.tableBody, styles.lblEstilo]}>${FormateoNumberInt(item.intValorTotal.toString())}</Text>
                                    <Text style={[styles.tableBody, styles.lblVendedor]}>{item.strNombVendedor}</Text>

                                </View>
                            )
                        })
                    }
                </View>
                <View style={styles.footerContainer}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={{ fontSize: 8, color: '#ccc', marginTop: 12 }}>
                            Reporte In Moda Fantasy S.A.S
                        </Text>
                    </View>

                </View>

            </Page>
        </Document >
    )
}


const styles = StyleSheet.create({
    page: {
        backgroundColor: '#fff',
        paddingVertical: 20
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    section: {
        marginHorizontal: 15,
        marginVertical: 5,
        padding: 5,
        flexGrow: 1,
        alignContent: 'flex-end'
    },
    subtitulo: {
        fontSize: 8,
        fontWeight: 900,
        marginVertical: 1,
        color: '#000'
    },
    texto: {
        fontSize: 9,
        color: '#444'
    },
    rowContainer: {
        marginHorizontal: 10,
        marginVertical: 2,
        paddingHorizontal: 5,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        paddingVertical: 4
    },
    titleContainer: {
        alignItems: 'flex-end',
        flexDirection: 'row'
    },
    subtitlesContainer: {
        backgroundColor: '#ccc',
        marginHorizontal: 10,
        marginVertical: 5,
        paddingHorizontal: 5,
        flexDirection: 'row',
    },
    tableHeader: {
        fontWeight: 'heavy',
        fontSize: 10
    },
    bodyContainer: {
    },
    tableBody: {
        fontSize: 8,
        color: '#111',
        minHeight: 10,
        display: 'flex'
    },
    lblItem: {
        width: '3%'
    },
    lblReferencia: {
        width: '12%'
    },
    lblDocumento: {
        width: '10%',
        overflow: 'hidden'
    },
    lblDescripcion: {
        width: '30%',
        overflow: 'hidden'
    },
    lblUnidad: {
        width: '11%'
    },
    lblEstilo: {
        width: '12%',
        overflow: 'hidden'
    },
    lblVendedor: {
        width: '30%',
        overflow: 'hidden'
    },
    lblEstado: {
        width: '12%',
    },
    lblPago: {
        width: '14%',
        overflow: 'hidden',
        marginLeft: 10
    },
    lblCantidad: {
        width: '8%'
    },
    lblPrecio: {
        width: '8%'
    },
    lblValorTotal: {
        width: '9%'
    },
    lblCambioPrecio: {
        color: 'red',
        fontSize: 12
    },
    footerContainer: {
        position: 'relative',
        bottom: 0,
        marginVertical: 10,
        marginHorizontal: 10,

    },
    observacionesContainer: {
        width: '70%',
        minHeight: 50,
    },
    totalesContainer: {
        width: '30%',
        flexDirection: 'row',
        paddingTop: 5,
        borderLeftWidth: 1,
        borderLeftColor: '#1B355D'
    },
    lblTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
        width: '40%'
    },
    lblVrTotal: {
        fontSize: 14,
        textAlign: 'left',
        width: '100%',
        paddingLeft: 10
    },
    footerDocumento: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#1B355D'
    },
    lblObservacion: {
        fontSize: 10,
        color: '#555'
    },
    editado: {
        textDecoration: 'underline',
    },
    direccionEstado: {
        display: 'flex',
        flexDirection: 'column',
        gap: 3
    },
    devolucion: {
        backgroundColor: 'red',
        textDecoration: 'underline',
        color: 'white',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5
    },
    lblAnulado: {
        backgroundColor: '#8F3B3B',
        color: 'white',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5
    },
    lblRecibido: {
        backgroundColor: 'rgb(125 211 252)',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5
    },
    lblImpreso: {
        backgroundColor: 'rgb(253 186 116)',
        color: 'black',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5
    },
    lblRevision: {
        backgroundColor: 'rgb(134 239 172)',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5
    },
    lblRevisado: {
        backgroundColor: 'rgb(190 242 100)',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5
    },
    lblAlistado: {
        backgroundColor: 'rgb(252 211 77)',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5
    },
    pago: {
        backgroundColor: 'rgb(190 242 100)',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5,
        textAlign: 'center'
    },
    sinPagar: {
        backgroundColor: 'rgb(252 211 77)',
        paddingHorizontal: 3,
        paddingVertical: 2,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 8
    }
});