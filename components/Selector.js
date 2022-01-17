
import dynamic from "next/dynamic";
import {ToastMessage} from '@adiranids/react-tailwind'
const Label = dynamic(() => import("./Label"));
const CustomFormGroup = dynamic(() => import("./CustomFormGroup"));
export default function Selector({label, options, change, error, value}) {
    return (
        <CustomFormGroup>
            <Label>{label}</Label>
            <select  className="p-2
                    border
                    focus:outline-none
                    rounded
                    transition-all
                    duration-200
                    ease-in-out
                    w-full"
                    onChange={(e)=>change(e.target.value)}
                    value={value}
            >
                <option value="">Select an option</option>
                {options.map((item,index) => <option key={index} value={item.value}>{item.label}</option>)}
            </select>
            <ToastMessage type="error">{error}</ToastMessage>
        </CustomFormGroup>
    )
}
