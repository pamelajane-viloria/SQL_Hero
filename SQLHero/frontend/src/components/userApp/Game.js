import React, { useState, useEffect } from "react";
import Close from '../../assets/images/close.svg';
import Correct from '../../assets/images/correct.svg';
import Wrong from '../../assets/images/wrong.svg';
import QueryPerson from '../../assets/images/person.svg';
import { DndContext } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import AwardModal from './AwardModal';
// import { BrowserRouter as Link } from 'react-router-dom';
import awardsData from '../../data/awards.json';
import { useParams, useNavigate } from 'react-router-dom';

function Game() {
    const [queryItems, setQueryItems] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [results, setResults] = useState({ data: [] });
    const [correct, setCorrect] = useState(null);
    const [levels, setLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState();
    const [correctQuery, setCorrectQuery] = useState('');
    const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);    
    const [earnedAward, setEarnedAward] = useState(null);
    const navigate = useNavigate();

    const { levelId } = useParams(); // Destructure levelId from useParams

    const addKeywordToQuery = (e) => {
        const newKeyword = e.active.data.current?.title;
        if (e.over?.id !== 'droppable' || !newKeyword) return;
        const temp = [...queryItems];
        temp.push(newKeyword);
        setQueryItems(temp);

        const updatedKeywords = keywords.filter((keyword) => keyword !== newKeyword);
        setKeywords(updatedKeywords);
    };

    useEffect(() => {
        fetchLevels(currentLevel); 
    }, [currentLevel]); 
    
    useEffect(() => {
        // console.log(levels); 
    }, [levels]); 
    
    const fetchLevels = async (levelIndex) => {
        let url = '';
        if (levelId) {
            url = `/api/levels/${levelId}`; 
        } else {
            url = `/api/levels/${levelIndex}`; 
        }
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const levelData = await response.json();
            const extractedKeywords = levelData.levelData.map(level => level.keywords.split(', ')).flat();
            const correctQueryValue = levelData.levelData[0]?.correct_query || "";
            setKeywords(extractedKeywords);
            setLevels(levelData);
            setCorrectQuery(correctQueryValue);
        } catch (error) {
            console.error('Error fetching levels:', error);
        }
    };

    const handleCheckButtonClick = async(event) => {
        const queryString = queryItems.join(' ');
        if (queryString === correctQuery) {
            event.target.innerText = event.target.innerText === 'Check' ? 'Continue' : 'Check';
            setCorrect(true);
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: queryString }),
            });
            const data = await response.json();
            setResults(data);
        } else {
            setCorrect(false);
        }
    };

    useEffect(() => {
        // console.log(results);
    }, [results]);

    const uniqueColumns = new Set(results.data.flatMap((row) => Object.keys(row)));

    const handleNextLevel = async () => {    
        const token = localStorage.getItem('authToken');
        const completedLevel = currentLevel + 1;
        const earnedAward = checkForAward(completedLevel);
        const nextLevelId = parseInt(levelId, 10) + 1;
        console.log(nextLevelId);
        try {
            const response = await fetch('/api/update-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, completedLevel }),
            });
            const data = await response.json();    
            if (data.message === 'User move to another level.') {
                navigate(`/Game/${nextLevelId}`);
                setCurrentLevel(completedLevel);
                setCorrect(null);
                setResults({ data: [] });
                setQueryItems([]);
                if (earnedAward) {
                    setEarnedAward(earnedAward);
                    setIsAwardModalOpen(true);
                    handleAddAchievement();
                }
            } else {
                console.error('Error updating user progress:', data.message);
            }
        } catch (err) {
            console.error('Error during API call:', err);
        }
    }

    const checkForAward = (userProgress) => {
        for (const awardKey in awardsData) {
            if (awardKey !== "login" && awardKey === userProgress.toString()) {
                return awardsData[awardKey];
            }
        }
        return null;
    };

    const handleAddAchievement = async () => {    
        const token = localStorage.getItem('authToken');
        const earnedAward = checkForAward(currentLevel + 1).name;
        try {
            const response = await fetch('/api/update-achievement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, earnedAward }),
            });
            const data = await response.json();    
            if (data.message === 'User earned an achievement.') {
                console.log('User earned an achievement.', earnedAward);
            } else {
                console.error('Error updating user progress:', data.message);
            }
        } catch (err) {
            console.error('Error during API call:', err);
        }
    }
      
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`/api/user-data`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                });                
                const data = await response.json();
                if (data.success) {
                    setCurrentLevel(data.user.current_level);
                } else {
                    console.error('Error fetching user data:', data.message);
                }
            } catch (err) {
                console.error('Error during API call:', err);
            }
        };
        fetchUserData();  
    }, [currentLevel]);

    return (
        <main className="relative min-h-screen bg-gray-900">
            <a href="/dashboard/home" className="absolute top-0 left-0 m-4"><img src={Close} alt="close" className="w-7"/></a>
            {levels.levelData && levels.levelData.length > 0 && (
                <section className="flex flex-col lg:flex-row p-5 lg:pb-0 pb-24">
                    {levels.levelData.map((level, index) => (
                        <div className="lg:w-1/2 px-8 mt-10" key={index}>               
                            <h1 className='font-bold text-2xl text-gray-200'>{level.level_title}</h1>
                            <p className='text-gray-300'>{level.level_description}</p>
                            <div className="flex justify-start items-center mt-4">
                                <img src={QueryPerson} alt="person" className="h-40"/>
                                <p className="speech-bubble ms-4 rounded-lg text-lg">{level.challenge}</p>
                            </div>
                            <DndContext onDragEnd={addKeywordToQuery}>
                                <Droppable items={queryItems} setQueryItems={setQueryItems} queryItems={queryItems} setKeywords={setKeywords} keywords={keywords} />
                                <ul>
                                    {keywords.map((keyword) => (
                                        <Draggable key={keyword}>{keyword}</Draggable>
                                    ))}
                                </ul>
                            </DndContext>
                        </div>
                    ))}
                    <div className="lg:w-1/2 px-8 mt-6">
                        <div className="relative overflow-x-auto">
                            {results.data?.length > 0 && (
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                                        <tr>
                                            {Array.from(uniqueColumns).map((key) => (
                                                <th key={key} scope="col" className="px-6 py-3">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.data.map((result, index) => (
                                            <tr key={index}>
                                            {Object.keys(result).map((key) => (
                                                <td key={key} className="px-6 py-4 text-white">
                                                {result[key]}
                                                </td>
                                            ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </section>
            )}
            {correct === null && (
                <section className="flex p-5 justify-end bg-gray-800 absolute bottom-0 fixed w-full h-40 items-center">
                    <button className="custom-btn me-8" onClick={handleCheckButtonClick}>Check answer</button>
                </section>
            )}

            {correct === true && (
                <section className="flex p-5 justify-between bg-green-400 absolute bottom-0 fixed w-full h-40 items-center">
                    <div className='flex items-center gap-3'>
                        <img src={Correct} alt='correct' className='w-32' />
                        <h2 className='text-2xl font-bold text-white'>That's correct! Good Job.</h2>
                    </div>
                    <button className="custom-btn me-8" onClick={handleNextLevel}>Continue</button>
                </section>
            )}

            {correct === false && (
                <section className="flex p-5 justify-between bg-secondary absolute bottom-0 w-full h-40 items-center">
                    <div className='flex items-center gap-3'>
                        <img src={Wrong} alt='correct' className='w-32' />
                        <div>
                            <h2 className='text-2xl font-bold text-white'>No worries, you're doing great! Let's give it another shot!</h2>
                            <p className="text-gray-200">Click the keywords to remove them from the query.</p>
                        </div>
                    </div>
                    <button className="custom-btn me-8" onClick={handleCheckButtonClick}>Check Again</button>
                </section>
            )}
            {isAwardModalOpen && (
                <AwardModal isOpen={isAwardModalOpen} award={earnedAward} onClose={() => setIsAwardModalOpen(false)} />
            )}
        </main>
    ); 
}

export default Game;