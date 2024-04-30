import React from 'react'

type TLabelSeguimientoValue = {
    text: string, 
    valueChange: string, 
    inputType: string, 
    valueInput: any
    disabled?:boolean
    handleChangeValueSeguimiento: (value:string, valueChange:string) => void
}


export const LabelSeguimiento:React.FC<TLabelSeguimientoValue> =({text, valueChange, inputType, valueInput, handleChangeValueSeguimiento, disabled = false}) => {
    return (
        <label className={`${inputType == 'checkbox' && "flex justify-center items-center"}`}>
            <p className='m-1'>{text}</p>
            <input
                type={inputType}
                disabled={disabled}
                value={valueInput !== null ? valueInput : ""}
                className={`min-w-[250px] px-2 py-1 rounded outline-gray-400 border gray-300 ${inputType == 'checkbox' && 'min-w-min'}`}
                onChange={(e) => {
                    handleChangeValueSeguimiento(e.target.value, valueChange)
                }}
            />
        </label>
    )
}
