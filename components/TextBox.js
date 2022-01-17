
import dynamic from "next/dynamic";
import {ToastMessage} from '@adiranids/react-tailwind'
const Label = dynamic(() => import("./Label"));
const CustomFormGroup = dynamic(() => import("./CustomFormGroup"));
export default function TextBox({ label, change, error, value }) {
  return (
    <CustomFormGroup>
      <Label>{label}</Label>
      <textarea
        value={value}
        className="p-2
                border
                focus:outline-none
                rounded
                transition-all
                duration-200
                ease-in-out w-full"
        rows="10"
        onInput={(e) => change(e.target.value)}
      ></textarea>
      <ToastMessage type="error">{error}</ToastMessage>
    </CustomFormGroup>
  );
}
