import React from 'react';
import HeroImage from '../../assets/images/player-hero.svg';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <section className='flex flex-col-reverse items-center justify-center py-24 lg:flex-row lg:justify-between lg:items-center lg:px-52 md:px-12 sm:px-5 px-5'>
            <ul className='w-full lg:w-2/5 text-center lg:text-left mb-8 lg:mb-0'>
                <li><h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>Learn SQL the Fun Way: Play Games, Earn Badges, Master Queries!</h1></li>
                <li><p className='text-gray-600 mt-4 mb-8 text-lg'>Turn SQL learning into an engaging adventure with interactive challenges, a rewarding badge system, and a supportive community.</p></li>
                <li>
                    <button onClick={handleRegisterClick} className='custom-btn'>Sign Up for Free</button>
                </li>
            </ul>
            <img src={HeroImage} alt='' className='w-full lg:w-3/5' />
        </section>
    );
}

export default HeroSection;