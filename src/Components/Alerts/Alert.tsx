import React, { ReactNode } from 'react'
import {AiOutlineCheckCircle} from 'react-icons/ai'
import {MdOutlineSmsFailed} from 'react-icons/md'
import {RxCross2} from 'react-icons/rx'

type AlertProps = {
    variant: "success" | "danger" | "warning";
    children: ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ variant = "success", children }) => {

    const classVariants = {
        success:{
            style:"py-4 px-12 shadow inline-block max-w-lg bg-lime-600 text-green-50 rounded-md m-2",
            icon:<AiOutlineCheckCircle/>
        },
        danger:{
            style:"py-4 px-12 shadow inline-block max-w-lg bg-red-500 text-red-50 rounded-md m-2",
            icon:<RxCross2/>
        },
        warning:{
            style:"py-4 px-12 shadow inline-block max-w-lg bg-yellow-600 text-orange-50 rounded-md m-2",
            icon:<MdOutlineSmsFailed/>
        }
    }

    return (
        <div className={`${classVariants[variant].style} flex gap-2 items-center`}>
            <span className='text-2xl'>
                {classVariants[variant].icon}
            </span>
            {children}
        </div>
    )
}
