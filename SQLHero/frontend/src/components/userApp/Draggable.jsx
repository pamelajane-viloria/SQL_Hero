import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const Draggable = ({ children }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: children,
        data: { title: children },
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes} 
            className='py-3 px-5 mb-1 me-1 font-semibold bg-white rounded-lg border border-gray-300 font-mono cursor-default'
        >
            {children}
        </button>
    );
};

export default Draggable;
