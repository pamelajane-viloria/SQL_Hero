import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '../../assets/images/home-1.svg';
import ChallengesIcon from '../../assets/images/challenges.svg';
import CommunityIcon from '../../assets/images/community-1.svg';
import ProfielIcon from '../../assets/images/profile.svg';
import Logout from '../../assets/images/logout.svg';

function UserDashboardNav() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <>
            {/* lg and above nav */}
            <nav className='hidden xl:flex lg:flex h-screen fixed border-r border-gray-300 bg-white'>
                <ul className='main-nav flex flex-col w-60 px-5 py-10 gap-5'>
                    <li className='mb-5'>
                        <Link to="/dashboard/home"><span className='font-black text-3xl tracking-wide'>SQL Hero</span></Link>
                    </li>
                    <li className={`rounded-lg hover:bg-gray-100 hover:ring-gray-100  ${location.pathname.includes('/home') ? 'active' : ''}`}>
                        <Link to="/dashboard/home" className="block p-3">
                            <img src={HomeIcon} alt='Home' className='w-8 inline-block align-middle' />
                            <span className='align-middle uppercase font-extrabold ms-4'>Home</span>
                        </Link>
                    </li>
                    <li className={`rounded-lg hover:bg-gray-100 hover:ring-gray-100 ${location.pathname.includes('/challenges') ? 'active' : ''}`}>
                        <Link to="/dashboard/challenges" className="p-3 block">
                            <img src={ChallengesIcon} alt='Challenges' className='w-8 inline-block align-middle' />
                            <span className='align-middle uppercase font-extrabold ms-4'>Challenges</span>
                        </Link>
                    </li>
                    <li className={`rounded-lg hover:bg-gray-100 hover:ring-gray-100 ${location.pathname.includes('/community') ? 'active' : ''}`}>
                        <Link to="/dashboard/community" className="p-3 block">
                            <img src={CommunityIcon} alt='Community' className='w-8 inline-block align-middle' />
                            <span className='align-middle uppercase font-extrabold ms-4'>Community</span>
                        </Link>
                    </li>
                    <li className={`rounded-lg hover:bg-gray-100 hover:ring-gray-100 ${location.pathname.includes('/profile') ? 'active' : ''}`}>
                        <Link to="/dashboard/profile" className="p-3 block">
                            <img src={ProfielIcon} alt='Profile' className='w-8 inline-block align-middle' />
                            <span className='align-middle uppercase font-extrabold ms-4'>Profile</span>
                        </Link>
                    </li>
                    <li className={`absolute bottom-0`}>
                        <button onClick={handleLogout} className="p-3 block">
                            <img src={Logout} alt='Profile' className='w-6 inline-block align-middle' />
                            <span className='align-middle text-red-500 font-bold ms-4'>Logout</span>
                        </button>
                    </li>
                </ul>
            </nav>
            {/* md and sm nav */}
            <nav className='xl:hidden lg:hidden w-screen fixed border-t border-gray-300 bottom-0 bg-white z-10'>
                <ul className='main-nav flex flex-row justify-center px-5 py-5 gap-8'>
                    <li className={`rounded-lg hover:bg-gray-100 hover:ring-gray-100  ${location.pathname.includes('/home') ? 'active' : ''}`}>
                        <Link to="/dashboard/home" className="p-3 flex items-center justify-center">
                            <img src={HomeIcon} alt='Home' className='w-10 inline-block align-middle' />
                        </Link>
                    </li>
                    <li className={`rounded-lg hover:bg-gray-100 hover:ring-gray-100 ${location.pathname.includes('/challenges') ? 'active' : ''}`}>
                        <Link to="/dashboard/challenges" className="p-3 flex items-center justify-center">
                            <img src={ChallengesIcon} alt='Challenges' className='w-10 inline-block align-middle' />
                        </Link>
                    </li>
                    <li className={`rounded-lg hover:bg-gray-100 hover:ring-gray-100 ${location.pathname.includes('/community') ? 'active' : ''}`}>
                        <Link to="/dashboard/community" className="p-3 flex items-center justify-center">
                            <img src={CommunityIcon} alt='Community' className='w-10 inline-block align-middle' />
                        </Link>
                    </li>
                    <li className={`rounded-lg hover:bg-gray-100 hover:ring-gray-100 ${location.pathname.includes('/profile') ? 'active' : ''}`}>
                        <Link to="/dashboard/profile" className="p-3 flex items-center justify-center">
                            <img src={ProfielIcon} alt='Profile' className='w-10 inline-block align-middle' />
                        </Link>
                    </li>
                    <li className={`rounded-lg hover:bg-gray-100 hover:ring-gray-100`}>
                        <button onClick={handleLogout} className="p-3 flex items-center justify-center">
                            <img src={Logout} alt='Profile' className='w-10 inline-block align-middle' />
                        </button>
                    </li>
                </ul>
            </nav>

        </>
    );
}

export default UserDashboardNav