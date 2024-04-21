import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Droppable = ({ items, setQueryItems, queryItems, keywords, setKeywords }) => {
	const { setNodeRef } = useDroppable({
		id: "droppable"
	});

	const handleRemoveItem = (itemToRemove) => {
        const updatedItems = queryItems.filter(item => item !== itemToRemove);
        setQueryItems(updatedItems);
		setKeywords(prevKeywords => [...prevKeywords, itemToRemove]);
    };

	return (
		<ul ref={setNodeRef} className='flex flex-wrap border-b-2 border-gray-500 bg-gray-800 min-h-14 my-3 pt-1 items-center px-1'>
			{items.map((item, idx) => (
				<li key={`${item}-${idx}`} className='py-3 px-5 mb-1 me-1 font-semibold bg-white rounded-lg border border-gray-300 font-mono cursor-default' onClick={() => handleRemoveItem(item)}>
					{item}
				</li>
			))}
		</ul>
	);
};

export default Droppable;
