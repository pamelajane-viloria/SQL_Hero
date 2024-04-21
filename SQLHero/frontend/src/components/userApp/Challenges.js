import React, { useState, useEffect } from 'react';
import Target from '../../assets/images/target.svg';
import DashboardNav from './UserDashboardNav';
import awardsData from '../../data/awards.json';

function Challenges() {
    const [userAchievements, setUserAchievements] = useState([]);
    const [currentUserLevel, setCurrentUserLevel] = useState(0);

    useEffect(() => {
        const fetchAchievements = async () => {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/user-data`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            });      
            const data = await response.json();
            if (data.success) {
                setUserAchievements(data.user.achievements || []);
                setCurrentUserLevel(data.user.current_level || 0);
            } else {
                console.error('Error fetching user data:', data.message);
            }
        };
        fetchAchievements();
    }, []);

    return (
        <main className='flex flex-row relative'>
            <DashboardNav />
            <section className='lg:w-1/2 lg:absolute lg:ms-64 mx-auto px-10 pb-24'>
                <div className="bg-primary w-full rounded-lg p-6 mt-7 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Conquer Challenges, Earn Rewards!</h1>
                        <p className="text-blue-50 mt-3 me-2">Test your skills and unlock exciting badges with our diverse challenges. Track progress, earn rewards, and discuss with the community. Dive in and see what you can achieve!</p>
                    </div>
                    <img src={Target} alt="target" className="h-40 hidden lg:block"/>
                </div>
                <ul>
                    <li><h2 className="text-2xl font-bold mt-10 border-b-2 pb-2">Unlocked Achivements</h2></li>
                    {userAchievements.length > 0 && (
                        <>
                            {Object.entries(awardsData).map(([key, award]) => (
                                userAchievements.includes(award.name) && (
                                    <li key={key} className="mt-4 flex gap-8 items-center">
                                        <img src={require(`../../assets/images/${award.image}`)} alt={award.name} className="h-28" />
                                        <div>
                                            <h1 className="text-xl font-bold">{award.name}</h1>
                                            <p className="text-gray-600 mt-2">{award.description}</p>
                                        </div>
                                    </li>
                                )
                            ))}
                        </>
                    )}                    
                    <li><h2 className="text-2xl font-bold mt-10 border-b-2 pb-2">Locked Achivements</h2></li>
                    {Object.entries(awardsData).map(([key, award]) => (
                        !userAchievements.includes(award.name) && (
                            <li key={key} className="mt-4 flex gap-8 items-center">
                                <img src={require(`../../assets/images/${award.image}`)} alt={award.name} className="h-28" />
                                <div>
                                    <h1 className="text-xl font-bold">{award.name}</h1>
                                    <p className="text-gray-600 mt-2">{award.to_achieve}</p>
                                </div>
                            </li>
                        )
                    ))}                
                </ul>
            </section>
        </main>
    );
}

export default Challenges;
