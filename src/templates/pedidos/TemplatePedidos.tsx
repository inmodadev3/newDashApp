import React from 'react'
import { Document, Page, Text, View, StyleSheet, Line, Svg } from '@react-pdf/renderer';
import { FormateoNumberInt } from '../../Utils/Helpers';
import { IDataPDF } from '../../Views/pdfs/pedidos/PedidosPDF';
import moment from 'moment';

interface IDatosPropsTemplatePedidos {
    datos: IDataPDF
}

export const TemplatePedidos: React.FC<IDatosPropsTemplatePedidos> = ({ datos }) => {

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
                            Pedido:
                            <Text style={styles.texto}>#{datos.header.intIdpedido}</Text>
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
                <View style={styles.headerContainer}>
                    <View style={[styles.section]}>
                        <Text style={styles.subtitulo}>
                            Nit:
                            <Text style={styles.texto}> {datos.header.strIdCliente}</Text>
                        </Text>
                        <Text style={styles.subtitulo}>
                            Cliente:
                            <Text style={styles.texto}> {datos.header.strNombCliente}</Text>
                        </Text>
                        <Text style={styles.subtitulo}>
                            Ciudad:
                            <Text style={styles.texto}> {datos.header.strCiudadCliente}</Text>
                        </Text>
                        <Text style={styles.subtitulo}>
                            Correo:
                            <Text style={styles.texto}> {datos.header.strCorreoClienteAct}</Text>
                        </Text>
                        <Text style={styles.subtitulo}>
                            Teléfono/Celular:
                            <Text style={styles.texto}> {datos.header.strTelefonoClienteAct}</Text>
                        </Text>
                    </View>
                    <View style={[styles.section, { alignItems: 'flex-end' }]}>

                        <Text style={styles.subtitulo}>

                        </Text>
                        <Text style={styles.subtitulo}>
                            Fecha pedido:
                            <Text style={styles.texto}> {moment(datos.header.dtFechaEnvio).format('DD-MM-yy / HH:mm:ss')}</Text>
                        </Text>
                        <Text style={styles.subtitulo}>
                            Vendedor:
                            <Text style={styles.texto}>{datos.header.strNombVendedor}</Text>
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
                <View style={styles.subtitlesContainer}>
                    <Text style={[styles.tableHeader, styles.lblItem]}>#</Text>
                    <Text style={[styles.tableHeader, styles.lblReferencia]}>Referencia</Text>
                    <Text style={[styles.tableHeader, styles.lblDescripcion]}>Descripción</Text>
                    <Text style={[styles.tableHeader, styles.lblEstilo]}>Guion</Text>
                    <Text style={[styles.tableHeader, styles.lblEstilo]}>ubicacion</Text>
                    <Text style={[styles.tableHeader, styles.lblUnidad]}>Observacion</Text>
                    <Text style={[styles.tableHeader, styles.lblUnidadMed]}>unidad</Text>
                    <Text style={[styles.tableHeader, styles.lblCantidad]}>Cantidad</Text>
                    <Text style={[styles.tableHeader, styles.lblPrecio]}>Precio</Text>
                    <Text style={[styles.tableHeader, styles.lblValorTotal]}>Valor Total</Text>
                </View>
                <View style={styles.bodyContainer}>
                    {
                        datos.data.map((item, index) => {
                            return (
                                <View style={styles.rowContainer} key={index}>
                                    <Text style={[styles.tableBody, styles.lblItem]}>{index + 1}</Text>
                                    <Text style={[styles.tableBody, styles.lblReferencia]}>{item.strIdProducto}</Text>
                                    <Text style={[styles.tableBody, styles.lblDescripcion]}>{item.strDescripcion}</Text>
                                    <Text style={[styles.tableBody, styles.lblEstilo]}>{item.strColor}</Text>
                                    <Text style={[styles.tableBody, styles.lblEstilo]}>{item.ubicaciones}</Text>
                                    <Text style={[styles.tableBody, styles.lblUnidad]}>{item.strObservacion}</Text>
                                    <Text style={[styles.tableBody, styles.lblUnidadMed]}>{item.strUnidadMedida}</Text>
                                    <Text style={[styles.tableBody, styles.lblCantidad]}>{item.intCantidad}</Text>
                                    <Text style={[styles.tableBody, styles.lblPrecio]}>{FormateoNumberInt((item.intPrecio).toString())}</Text>
                                    <Text style={[styles.tableBody, styles.lblValorTotal]}>{FormateoNumberInt((item.intCantidad * item.intPrecio).toString())} 
                                    <Text style={styles.lblCambioPrecio}>{item.precio_cambio && " * "}</Text></Text>
                                </View>
                            )
                        })
                    }
                </View>
                <View style={styles.footerContainer}>
                    <View style={styles.footerDocumento}>
                        <View style={styles.observacionesContainer}>
                            <Text style={{ color: '#000', fontSize: 10 }}>
                                Observacion:
                                <Text style={styles.lblObservacion}>
                                    {datos.header.strObservacion ? datos.header.strObservacion : ""}
                                </Text>
                            </Text>

                        </View>
                        <View style={styles.totalesContainer}>
                            <Text style={styles.lblTotal}>
                                Total:
                            </Text>
                            <Text style={styles.lblVrTotal}>
                                $ {FormateoNumberInt((datos.header.intValorTotal).toString())}
                            </Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                        <Text style={{ fontSize: 8, color: '#ccc' }}>
                            Factura In Moda Fantasy S.A.S
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
        width: '20%',
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
        color:'red',
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