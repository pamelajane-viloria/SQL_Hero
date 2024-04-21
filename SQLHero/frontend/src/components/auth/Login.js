import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const validateUsername = (username) => {
        if (username.length === 0) {
            return 'Username is required.';
        }
        return null;
    };

    const validatePassword = (password) => {
        if (password.length === 0) {
            return 'Password is required.';
        }
        return null;
    };

    const validateForm = () => {
        const errors = {};
        const usernameError = validateUsername(username);
        const passwordError = validatePassword(password);
    
        if (usernameError) {
            errors.username = usernameError;
        }
        if (passwordError) {
            errors.password = passwordError;
        }
    
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        setUsernameError(errors.username || null);
        setPasswordError(errors.password || null);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.message === 'Login successful!') {
                await localStorage.setItem('authToken', data.token); // Await storage
                navigate('/dashboard/home');
            } else {
                setErrorMessage(data.message);
                console.log(data.message);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Internal server error!');
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    }

    const handleCancelClick = () => {
        navigate('/');
    }

    return (
        <section className="max-w-md md:mx-auto my-24 mx-10">
            <h1 className='font-bold text-4xl'>Welcome Back!</h1>
            <p className='text-gray-500 text-sm mt-2'>Don't have an account? <button onClick={handleRegisterClick} className='text-primary font-semibold'>Register here</button></p>
            <form onSubmit={handleSubmit}>
                <ul className='mt-5'>
                    <li className="mb-5">
                        <label htmlFor="username" className="block mb-2 font-medium">Your username <span className='text-red-600'>*</span></label>
                        <input 
                            type="text"
                            name='username' 
                            id="username" 
                            className="text-sm bg-gray-50 border border-gray-300 rounded-lg focus:border-primary block w-full p-2.5" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Enter your username here'
                            autoComplete='off' 
                        />
                        {usernameError && <p className="error-message">{usernameError}</p>}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </li>
                    <li className="mb-2 relative">
                        <label htmlFor="password" className="block mb-2 font-medium">Your password <span className='text-red-600'>*</span></label>
                        <div className="relative">
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                id="password"
                                className="text-sm bg-gray-50 border border-gray-300 rounded-lg focus:border-primary block w-full p-2.5 pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password here'
                            />
                            {passwordError && <p className="error-message">{passwordError}</p>}
                            <span className="absolute top-2 right-0 flex items-center pr-3" onClick={togglePasswordVisibility}>
                                {isPasswordVisible ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 stroke-gray-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </span>
                        </div>
                    </li>
                </ul>
                <button type="submit" className="custom-btn w-full mt-5">Login</button>            
                <button onClick={handleCancelClick} className="w-full mt-5 font-semibold text-gray-500">Cancel</button>            
            </form>
        </section>
    );
}

export default Login;