import axios from '../../../Utils/BaseUrlAxio'
import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../../Components/AppLayout/AppLayout'
import { MenuSelectedContext } from '../../../context/UseContextProviders'
import { IDataUser } from '../../../Utils/GlobalInterfaces'
import { useNavigate } from 'react-router-dom'
import { PiFilePdfFill } from 'react-icons/pi'
import { AiOutlineDownload } from 'react-icons/ai'
import { URLAPI } from '../../../Utils/Helpers'
import moment from 'moment'
import { MenuSections, SubMenuSections } from '../../../Components/MenuLateral/MenuSections'


type TPDFSData = {
    "name": string,
    "dateCreated": string,
    "dateModified": string
}

export const Ver_Catalogos: React.FC = () => {

    const userData: string | null = localStorage.getItem('dataUser');
    let userInfo: IDataUser | null = null!;

    const [fileList, setfileList] = useState<TPDFSData[] | null>([])

    const { setMenuSelected, setSubmenuSelected } = useContext(MenuSelectedContext)
    const navigate = useNavigate()

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

    const downloadPDF = (url: string, filename: string) => {
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
    };

    fileList?.sort((a, b) => b.dateModified.localeCompare(a.dateModified));


    return (
        <AppLayout>
            <section className='max-h-screen overflow-y-scroll'>
                {
                    fileList !== null && (
                        fileList.map((file, index) => (
                            <div key={index} className='py-8 px-4 flex border-b-2 border-b-gray-300 items-center justify-between hover:bg-gray-200 ' >
                                <div className='flex items-center gap-x-4 z-10' onClick={() => { window.open(`${URLAPI}/pdfs/${userInfo?.idLogin}/${file.name}`) }}>
                                    <span><PiFilePdfFill size={25} color={'red'} /></span>
                                    <span className='text-sm cursor-default w-[420px] truncate'>{(file.name).replace('.pdf','')}</span>
                                </div>
                                <div>
                                    <span>{moment(file.dateModified).format('YY-MM-DD / HH:mm')}</span>
                                </div>
                                <div>
                                    <span
                                        className='cursor-pointer  flex justify-center items-center z-20'
                                        onClick={()=>{downloadPDF(`${URLAPI}/pdfs/${userInfo?.idLogin}/${file.name}`, file.name)}}
                                    >
                                        <AiOutlineDownload size={25} />
                                    </span>
                                </div>
                            </div>
                        ))
                    )
                }
            </section>

        </AppLayout>
    )
}
