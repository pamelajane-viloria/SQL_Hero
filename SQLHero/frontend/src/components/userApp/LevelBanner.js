import React from 'react';
import LevelItem from './LevelItem';
import RightArrow from '../../assets/images/arrow-right.svg';

function LevelBanner({ level, title, description, currentLevel, levelItems }) {
    return (
        <>
            <div className={`relative ${level} text-white lg:w-2/3 w-full rounded-lg px-5 py-4 mx-auto mt-7`}>
                <h2 className='font-bold text-3xl text-white'>{title}</h2>
                <p className='font-semibold text-blue-100 me-10'>{description}</p>
                <a href={`/Game/${currentLevel}`} className='absolute right-4 bottom-3 size-10'>
                    <img src={RightArrow} alt='continue learning' />
                </a>
            </div>
            <ul className="mt-5 text-center">
                {levelItems.map((level) => (
                    <LevelItem key={level.id} level={level} currentLevel={currentLevel} />
                ))}
            </ul>
        </>
    );
}

export default LevelBanner;
