import axios from '../../../Utils/BaseUrlAxio'
import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { IDataUser } from '../../../Utils/GlobalInterfaces'
import { useNavigate } from 'react-router-dom'
/* import { PiFilePdfFill } from 'react-icons/pi'
import { AiOutlineDownload } from 'react-icons/ai'
import { URLAPI } from '../../../Utils/Helpers'
import moment from 'moment' */
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'


type TPDFSData = {
    "name": string,
    "dateCreated": string,
    "dateModified": string
}

type TypeCatalogo = {
    name_catalogo: string
    link: string
}

interface Catalogos {
    name: string
    link: string,
    catalogos: TypeCatalogo[]
}

export const Ver_Catalogos: React.FC = () => {

    const userData: string | null = localStorage.getItem('dataUser');
    let userInfo: IDataUser | null = null!;

    const [fileList, setfileList] = useState<TPDFSData[] | null>([])
    const [expandedIndex, setExpandedIndex] = useState(-1);

    const toggleAccordion = (index: number) => {
        setExpandedIndex((prevIndex) => (prevIndex === index ? -1 : index));
    };

    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const navigate = useNavigate()

    const files: Catalogos[] = [
        {
            name: "Precio 1",
            link: "",
            catalogos: [
                { name_catalogo: "Belleza", link: "https://drive.google.com/file/d/1eOWL_mK2CQXDnaSoAffWTecHJelZJO5K/view?usp=drive_link" },
                { name_catalogo: "Hogar y Ferreteria", link: "https://drive.google.com/file/d/1Dcj-c28UQytBUeV2JnOOMl9qsc3WFoGk/view?usp=drive_link" },
                { name_catalogo: "Insumos Medicos", link: "https://drive.google.com/file/d/1-UgGVB4ECOLHMR5ErOBD2vViyLwtczRY/view?usp=drive_link" },
                { name_catalogo: "Joyeria y Fantasia", link: "https://drive.google.com/file/d/1qfnsSlOwKsnLDTeYDTg5e-3AN1u7IDNK/view?usp=sharing" },
                { name_catalogo: "Mascotas", link: "https://drive.google.com/file/d/1s76bxPektSx8M7IkZJv4S-eWWW9wZSYL/view?usp=drive_link" },
                { name_catalogo: "Modas y accesorios", link: "https://drive.google.com/file/d/1jxOGXm4l6ayS43Ny3OQwEHqGkMZ1cz-0/view?usp=drive_link" },
                { name_catalogo: "Papeleria", link: "https://drive.google.com/file/d/1VmQWy52VEZ8mRvIy6vocZbTVqF9xdSI_/view?usp=drive_link" },
                { name_catalogo: "Bisuteria", link: "https://drive.google.com/file/d/101w7ttyWVPG2Y-v3-7yBdfjcPrerrZnT/view?usp=sharing" },
                { name_catalogo: "Careys", link: "https://drive.google.com/drive/folders/1rARNhiIxOMZ2ubg6-ktc6Labs4lfqBI9?usp=drive_link" }
            ]
        },
        {
            name: "Precio 2",
            link: "",
            catalogos: [
                { name_catalogo: "Belleza", link: "https://drive.google.com/file/d/194PBzvE03SRlcjweTrrLAtayU5WHRDf2/view?usp=drive_link" },
                { name_catalogo: "Hogar y Ferreteria", link: "https://drive.google.com/file/d/1UJVxBh5SaDzehWmGzHq2eJnTsMC1XfKU/view?usp=drive_link" },
                { name_catalogo: "Insumos Medicos", link: "https://drive.google.com/file/d/1o0aICxOV2H4ZIlM1GC-SOJgZHLqCMP5H/view?usp=drive_link" },
                { name_catalogo: "Joyeria y Fantasia", link: "https://drive.google.com/file/d/12Sh2wRfkN2FJjQSjNfHfCmdO9Gnk6gbF/view?usp=drive_link" },
                { name_catalogo: "Mascotas", link: "https://drive.google.com/file/d/1refyKKah1YGbElHTAFIf_pv-zEXUnZuN/view?usp=drive_link" },
                { name_catalogo: "Modas y accesorios", link: "https://drive.google.com/file/d/14Vu8WipvMmrgFRGm_fmIWyu4pGMQh4Mg/view?usp=drive_link" },
                { name_catalogo: "Papeleria", link: "https://drive.google.com/file/d/1nygNZEaLjW2eZ2YsvzTzjeIzaFiJHcka/view?usp=drive_link" },
                { name_catalogo: "Bisuteria", link: "https://drive.google.com/file/d/1Nb_LU59nOge9T8ubY07995NCJgX7HxX3/view?usp=drive_link" },
                { name_catalogo: "Careys", link: "https://drive.google.com/drive/folders/1Tn4ft3-m3LTrYkosobw6DDSTANdhSAnr?usp=drive_link" }
            ]
        },
        {
            name: "Precio 3",
            link: "",
            catalogos: [
                { name_catalogo: "Belleza", link: "https://drive.google.com/file/d/1P3jz53gTJpmq-wtJXnRTxoGCnRbvpHeL/view?usp=drive_link" },
                { name_catalogo: "Hogar y Ferreteria", link: "https://drive.google.com/file/d/1_mhU9obbiaqUE6JxAd49m94GoD_xU4oB/view?usp=drive_link" },
                { name_catalogo: "Insumos Medicos", link: "https://drive.google.com/file/d/1Y-usGKHG4EG7WEmZlQ8opjosvDHHUGHB/view?usp=drive_link" },
                { name_catalogo: "Joyeria y Fantasia", link: "https://drive.google.com/file/d/1nMu_BKgcIVcpHMTFD0qZymo6Y3ttCQzk/view?usp=drive_link" },
                { name_catalogo: "Mascotas", link: "https://drive.google.com/file/d/1H2yoRaIYE1cZkQ-CIeAsVOYHRoMJd1UK/view?usp=drive_link" },
                { name_catalogo: "Modas y accesorios", link: "https://drive.google.com/file/d/1mUQY1hw3DryPR_ijPxxJ03SKp1ZHQDfl/view?usp=drive_link" },
                { name_catalogo: "Papeleria", link: "https://drive.google.com/file/d/1IhgnyzdNgDzbkSCimagmVtgtdGot2oQh/view?usp=drive_link" },
                { name_catalogo: "Bisuteria", link: "" },
                { name_catalogo: "Careys", link: "https://drive.google.com/drive/folders/13EflprdYMeZ1gbZ_vnQVFxGX6ltF6WEd?usp=drive_link" }
            ]
        },
        {
            name: "Precio 4",
            link: "",
            catalogos: [
                { name_catalogo: "Belleza", link: "https://drive.google.com/file/d/1VLMEcFntCNphky2uYHUj88u97WyaIsuX/view?usp=drive_link" },
                { name_catalogo: "Hogar y Ferreteria", link: "https://drive.google.com/file/d/1uN7b8JPgsxGWwQQnKR0wU_uA1tfE4i9X/view?usp=drive_link" },
                { name_catalogo: "Insumos Medicos", link: "https://drive.google.com/file/d/1WCJ0PC57__fPe_Kt9ORPNzplzVfASsdY/view?usp=drive_link" },
                { name_catalogo: "Joyeria y Fantasia", link: "https://drive.google.com/file/d/1Z-ViBrtVw3zii1-SuXXhUqpiKfYAiucW/view?usp=drive_link" },
                { name_catalogo: "Mascotas", link: "https://drive.google.com/file/d/1Se-1iCF4izLN1kch0253VYkNbUN8OQ99/view?usp=drive_link" },
                { name_catalogo: "Modas y accesorios", link: "https://drive.google.com/file/d/1Bf1wibh9zRS3p-h97r3R5Wdx0AG3fkbb/view?usp=drive_link" },
                { name_catalogo: "Papeleria", link: "https://drive.google.com/file/d/1CMF_EwIrFkxU9wt_THvZ-OcZ6ajVaJlE/view?usp=drive_link" },
                { name_catalogo: "Bisuteria", link: "https://drive.google.com/file/d/1oya3hQacYJULe8ytvvaLdficlZtbZlgr/view?usp=drive_link" },
                { name_catalogo: "Careys", link: "https://drive.google.com/drive/folders/1eVTQ7R_A8ZYqWGZzpzjDNKXKeNBkyAXS?usp=drive_link" }
            ]
        }
    ];


    if (userData) {
        userInfo = JSON.parse(userData);
    } else {
        navigate('/login');
    }

    useEffect(() => {
        setMenuSelected(MenuSections.CATALOGOS)
        setSubmenuSelected(SubMenuSections.VER_CATALOGOS_PDF)
        consultarPDFSVendedor()
    }, [])

    const consultarPDFSVendedor = () => {
        axios.get(`/pdfs/${userInfo?.idLogin}`)
            .then((response) => {
                setfileList(response.data.fileList)
            }).catch((err) => {
                console.error(err)
            })
    }

    /* const downloadPDF = (url: string, filename: string) => {
        axios.get(url, { responseType: 'blob' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();

                URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error(err);
            });
    }; */

    fileList?.sort((a, b) => b.dateModified.localeCompare(a.dateModified));


    return (
        <AppLayout>
            <section className='max-h-screen my-8'>

                <div className="accordion">
                    {files.map((precio, index) => (
                        <div key={index} className="mb-6 border border-gray-300 rounded">
                            <button
                                className="w-full px-4 py-3 font-bold text-left bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                                onClick={() => toggleAccordion(index)}
                                aria-expanded={expandedIndex === index}
                                aria-controls={`accordion-content-${index}`}
                            >
                                {precio.name}
                            </button>
                            <div
                                id={`accordion-content-${index}`}
                                className={`accordion-content ${expandedIndex === index ? 'block' : 'hidden'
                                    }`}
                            >
                                <ul className="border-t border-gray-300">
                                    {precio.catalogos.map((catalogo, i) => (
                                        <a href={catalogo.link} target='_blank' className='w-full' key={i}>
                                            <li
                                                className="w-full px-4 py-2 cursor-pointer focus:bg-gray-100 hover:bg-blue-200"
                                            >

                                                {catalogo.name_catalogo}

                                            </li>
                                        </a>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* {
                    fileList !== null && (
                        fileList.map((file, index) => (
                            <div key={index} className='flex items-center justify-between px-4 py-8 border-b-2 border-b-gray-300 hover:bg-gray-200 ' >
                                <div className='z-10 flex items-center gap-x-4' onClick={() => { window.open(`${URLAPI}/pdfs/${userInfo?.idLogin}/${file.name}`) }}>
                                    <span><PiFilePdfFill size={25} color={'red'} /></span>
                                    <span className='text-sm cursor-default w-[420px] truncate'>{(file.name).replace('.pdf','')}</span>
                                </div>
                                <div>
                                    <span>{moment(file.dateModified).format('YY-MM-DD / HH:mm')}</span>
                                </div>
                                <div>
                                    <span
                                        className='z-20 flex items-center justify-center cursor-pointer'
                                        onClick={()=>{downloadPDF(`${URLAPI}/pdfs/${userInfo?.idLogin}/${file.name}`, file.name)}}
                                    >
                                        <AiOutlineDownload size={25} />
                                    </span>
                                </div>
                            </div>
                        ))
                    )
                } */}
            </section>

        </AppLayout>
    )
}
