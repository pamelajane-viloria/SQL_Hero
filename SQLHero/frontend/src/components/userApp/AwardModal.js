import React from "react";

function AwardModal({ isOpen, onClose, award }) {
    const imagePath = require(`../../assets/images/${award.image}`);
    return (
        <div tabIndex="-1" className={`${isOpen ? '' : 'hidden'} fixed inset-0 flex justify-center items-center bg-stone-900/50`}>
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="p-4 md:p-5 text-center">
                        <p className="mb-5 text-lg text-semibold">You just earned an achievement!</p>
                        <img src={imagePath} alt={award.name} className="h-32 inline-block"/>
                        <h2 className="font-bold text-3xl">{award.name}</h2>
                        <p className="text-gray-500 text-sm mt-2 mb-5">{award.description}</p>
                        <button onClick={onClose} type="button" className="custom-btn w-full">Continue</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AwardModal;