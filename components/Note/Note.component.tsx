import { FC, useRef } from "react";
import Draggable from "react-draggable";
import INote from "./note.types";



const Note: FC<INote> = ({ children, properties, cornerProperties, position }) => {
    const nodeRef = useRef(null);

    return (
        <Draggable nodeRef={nodeRef} defaultPosition={position} >
            <article ref={nodeRef}  className={`${properties} text-gray-800 md:text-xl leading-normal md:h-96 md:w-96 xs:w-5/6 xs:h-2/3 xs:min-h-[18rem] md:m-10 xs:m-3 xs:mt-5 p-5  xs:text-base  shadow-xl relative overflow-hidden`}>
                <div className={`${cornerProperties} absolute top-0 left-0 w-5 h-8  transform rotate-45 -translate-x-2 -translate-y-2`}></div>
                {children}
            </article>
        </Draggable>
    );
};

export default Note;
