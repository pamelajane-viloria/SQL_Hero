import React from 'react';
import Completed from '../../assets/images/completed.svg';
import Current from '../../assets/images/current-level.svg';
import Locked from '../../assets/images/locked.svg';
import { useNavigate } from 'react-router-dom';

function LevelItem({ level, currentLevel }) {
    const navigate = useNavigate();
    const isCompleted = level.id <= currentLevel;
    const isCurrent = level.id === currentLevel;
    const levelStatus = () => {
        if (isCurrent) {
            return 'current ring-4 ring-offset-4 ring-gray-400';
        } else if (isCompleted) {
            return 'completed';
        } else {
            return 'locked';
        }
    };

    const openGame = (levelId) => {
        navigate(`/Game/${levelId}`);
    };

    return (
        <li className="mt-5">
            <a 
                className={`level-path-btn mx-2 ${levelStatus()}`} 
                onClick={() => {
                    if (isCompleted || isCurrent) {
                    openGame(level.id);
                    }
                }}
            >
                <img src={isCurrent ? Current : isCompleted ? Completed : Locked} className='size-14'/>
            </a>
        </li>
    );
}

export default LevelItem;
