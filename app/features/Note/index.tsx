import { ReactProps } from "@/app/types";
import { FC } from "react";
import Draggable from "react-draggable";



const Note: FC<ReactProps> = ({ children }) => {

    return (
        <Draggable>
            <div   className="text-gray-800 text-xl h-96 w-96 m-10 cursor-pointer p-4 bg-yellow-100 shadow-xl relative overflow-hidden">
                <div className=" absolute top-0 left-0 w-4 h-8 bg-yellow-200 transform rotate-45 -translate-x-2 -translate-y-2"></div>
                {children}
            </div>
        </Draggable>
    );
};

export default Note;
