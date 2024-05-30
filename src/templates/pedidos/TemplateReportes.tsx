import React from 'react'
import { Document, Page, Text, View, StyleSheet, Line, Svg } from '@react-pdf/renderer';
import { FormateoNumberInt } from '../../Utils/Helpers';
import { PropsReportes } from '../../Views/pdfs/pedidos/ReportesDropiPDF';
import moment from 'moment';

type Props = {
    datos: PropsReportes[]
}


export const TemplateReportes: React.FC<Props> = ({ datos }) => {

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
                    <Text style={[styles.tableHeader, styles.lblDescripcion]}>Documento</Text>
                    <Text style={[styles.tableHeader, styles.lblReferencia]}>Fecha</Text>
                    <Text style={[styles.tableHeader, styles.lblDescripcion]}>Cliente</Text>
                    <Text style={[styles.tableHeader, styles.lblEstilo]}>Valor</Text>
                    <Text style={[styles.tableHeader, styles.lblEstilo]}>Vendedor</Text>
                </View>
                <View style={styles.bodyContainer}>
                    {
                        datos.map((item, index) => {
                            return (
                                <View style={styles.rowContainer} key={index}>
                                    <Text style={[styles.tableBody, styles.lblDescripcion]}>{item.intIdPedido}</Text>
                                    <Text style={[styles.tableBody, styles.lblReferencia]}>{moment.utc(item.dtFechaEnvio).local().format('YYYY-MM-DD')}</Text>
                                    <Text style={[styles.tableBody, styles.lblDescripcion]}>{item.strNombCliente}</Text>
                                    <Text style={[styles.tableBody, styles.lblEstilo]}>${FormateoNumberInt(item.intValorTotal.toString())}</Text>
                                    <Text style={[styles.tableBody, styles.lblEstilo]}>{item.strNombVendedor}</Text>
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
        </Document>
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
        borderBottomColor: '#ccc'
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
    lblUnidadMed: {
        width: '6%'
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
    }
});