import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import AchievementFirstTime from '../../assets/images/achievement-first-time-user.svg';
import ProgressIcon from '../../assets/images/progress-icon.svg';
import LevelBanner from './LevelBanner';
import DashboardNav from './UserDashboardNav';
import awardsData from '../../data/awards.json';

function UserDashboard() {
    const [currentLevel, setCurrentLevel] = useState('');
    const [levelCategories, setLevelCategories] = useState('');
    const [levelPercentage, setLevelPercentage] = useState('');
    const [username, setUsername] = useState('');
    const [userAchievements, setUserAchievements] = useState([]);

    // Get user data and level data
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const currentLevelResponse = await fetch(`/api/user-data`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const currentLevelData = await currentLevelResponse.json();
                if (currentLevelData.success) {
                    setCurrentLevel(currentLevelData.user.current_level);
                    setUsername(currentLevelData.user.username);
                    setUserAchievements(currentLevelData.user.achievements || []);
                } else {
                    console.error('Error fetching current level:', currentLevelData.message);
                }
    
                const levelsResponse = await fetch('/api/levels', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const levelsData = await levelsResponse.json();
                if (levelsData.success) {
                    const categorizedLevels = {
                        easy: [],
                        moderate: [],
                        hard: []
                    };
                    levelsData.rows.forEach(level => {
                        if (level.id >= 1 && level.id <= 10) {
                            categorizedLevels.easy.push(level);
                        } else if (level.id >= 11 && level.id <= 20) {
                            categorizedLevels.moderate.push(level);
                        } else if (level.id >= 21 && level.id <= 30) {
                            categorizedLevels.hard.push(level);
                        }
                    });
                    setLevelCategories(categorizedLevels);
                    
                } else {
                    console.error('Error fetching levels:', levelsData.message);
                }
            } catch (err) {
                console.error('Error during API call:', err);
            }
        };
        fetchUserData();
        
    }, []);

    useEffect(() => {
        const progress = (currentLevel / 30) * 100;
        setLevelPercentage(progress);
    }, [currentLevel]);

    return (
        <main className='flex flex-row relative'>
            <DashboardNav />
            <section className='px-10 py-10 w-full'>
                <div className='relative flex flex-col justify-between'>
                    <section className='lg:w-1/2 lg:absolute lg:ms-64 mx-auto pb-24'>
                        <h1 className='text-xl font-bold'>Welcome back, {username}!</h1>
                        {Object.keys(levelCategories).map(category => (
                            <LevelBanner
                                key={category}
                                level={category}
                                title={category === 'easy' ? 'Baby Steps' : category === 'moderate' ? 'Challenge Accepted!' : 'Mastermind in the Making'}
                                description={category === 'easy' ? 'Master the fundamentals and build a strong foundation.' : category === 'moderate' ? 'Put your skills to the test with increasing difficulty.' : 'Hone your skills and become a true expert.'}
                                currentLevel={currentLevel}
                                levelItems={levelCategories[category]}
                            />
                        ))}
                    </section>
                    <section className='w-1/3 fixed right-0 lg:block xl:block hidden'>
                        <ul className='flex flex-col gap-4'>
                            {userAchievements.length > 0 && (
                                <>
                                    {Object.entries(awardsData).map(([key, award]) => (
                                        userAchievements.includes(award.name) && (
                                            <li key={key} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg">
                                                <h2 className="mb-2 text-xl font-bold text-gray-900">Achievements</h2>
                                                <div className='flex justify-between items-center gap-4 mt-3'>
                                                    <img src={require(`../../assets/images/${award.image}`)} alt={award.name} className='size-16' />
                                                    <ul>
                                                        <li className='font-bold text-primary text-lg'>{award.name}</li>
                                                        <li className='text-sm text-gray-500'>{award.description}</li>
                                                    </ul>
                                                </div>
                                            </li>
                                        )
                                    ))}
                                </>
                            )|| (
                                <li className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg">
                                    <h2 className="mb-2 text-xl font-bold text-gray-900">Achievements</h2>
                                    <p className="text-center text-gray-500">No achievements unlocked yet!</p>
                                </li>
                            )}
                            <li className="block w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg">
                                <h2 className="mb-2 text-xl font-bold">Progress</h2>
                                <div className='flex mt-3'>
                                    <img src={ProgressIcon} alt='Progress, rocket ship' className='w-16' />
                                    <div className='relative w-full'>
                                        <h3 className='font-bold text-primary text-lg mb-2'>Learning Progress</h3>
                                        <span className='absolute top-6 bg-ternary text-secondary font-bold text-lg size-10 rounded-full flex justify-center items-center border-4 border-white'>1</span>
                                        <div className="w-full h-4 mb-4 bg-gray-200 rounded-full">
                                            <div className="h-4 bg-primary rounded-full" style={{ width: `${levelPercentage}%` }}></div>
                                        </div>
                                        <span className='absolute top-6 right-0 bg-ternary text-secondary font-bold text-lg size-10 rounded-full flex justify-center items-center border-4 border-white'>30</span>
                                    </div>
                                </div>
                                <a href={`/Game/${currentLevel}`} className='custom-btn w-full mt-3'>Continue Learning</a>
                            </li>
                        </ul>
                    </section>            
                </div>
            </section>
        </main>
    );  
}

export default UserDashboard;