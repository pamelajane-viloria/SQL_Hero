import React, { useState } from 'react';

const PasswordInput = () => {
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="relative">
            <input 
                type={isVisible ? "text" : "password"} 
                id="password" 
                className="text-sm bg-gray-50 border border-gray-300 rounded-lg focus:border-primary block w-full p-2.5 pr-10" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password here' 
            />
            <button 
                type="button"
                onClick={toggleVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
                {isVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 2C5.63 2 2 6.13 2 10s3.63 8 8 8 8-3.13 8-8-3.63-8-8-8zM2 10c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M4.293 5.293a1 1 0 011.414 1.414l-1.586 1.586a7 7 0 109.192 9.192l-1.586 1.586a1 1 0 01-1.414-1.414l1.586-1.586a5 5 0 11-6.364-6.364L4.293 5.293z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default PasswordInput;
