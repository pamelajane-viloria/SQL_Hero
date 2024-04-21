import React, { useState, useEffect } from "react";

function Alert ({ message }) {
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
        setIsVisible(true); 
        const timeout = setTimeout(() => setIsVisible(false), 3000);
    
        return () => clearTimeout(timeout);
    }, [message]); 
  
    return (
        isVisible && (
            <div className="fixed flex items-center w-full z-10 top-10">
                <div className="alert-container mx-auto w-1/3 text-white flex justify-center rounded-lg py-3 bg-green-100 transition-opacity duration-700">
                    <img src="https://www.svgrepo.com/show/362151/sign-check.svg" alt="Alert Success" className="size-5 me-2" />
                    <span className="font-semibold text-green-500">{message}</span>
                </div>            
            </div>
        )
    );
}

export default Alert;
