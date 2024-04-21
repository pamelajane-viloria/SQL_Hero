import React from 'react';
import SqlHeroLogo from '../../assets/images/SQL Hero Logo.png';
import { useNavigate } from 'react-router-dom';

function LandingNav() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };
    
    return (
        <nav className='lg:px-52 md:px-12 sm:px-5 px-5 py-3 flex justify-between items-center border-b'>
            <span className='font-black lg:text-3xl md:text-2xl sm:text-lg text-lg tracking-wide'>SQL Hero</span>
            <button onClick={handleLoginClick} className='custom-btn'>Start Playing</button>
        </nav>
    );
}

export default LandingNav;