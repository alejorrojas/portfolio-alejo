import { ReactProps } from "@/app/types";
import { FC, useRef } from "react";
import Draggable from "react-draggable";



const Note: FC<ReactProps> = ({ children }) => {
    const nodeRef = useRef(null);

    return (
        <Draggable nodeRef={nodeRef}>
            <article ref={nodeRef}  className="text-gray-800 md:text-xl leading-normal md:h-96 md:w-96 xs:w-5/6 xs:h-5/6 md:m-10 xs:m-3 xs:mt-5 p-5  xs:text-base bg-yellow-100 shadow-xl relative overflow-hidden">
                <div className=" absolute top-0 left-0 w-5 h-8 bg-yellow-200 transform rotate-45 -translate-x-2 -translate-y-2"></div>
                {children}
            </article>
        </Draggable>
    );
};

export default Note;
