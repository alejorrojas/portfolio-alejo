import { ReactProps } from "@/app/types";

export default interface INote extends ReactProps{
    //Optional properties for specific outside styling 
    properties?: string,
    cornerProperties?: string,
    position?: {
        x: number,
        y: number
    },
    cancel?: string
}