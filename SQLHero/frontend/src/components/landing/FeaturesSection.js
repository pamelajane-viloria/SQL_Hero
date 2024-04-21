import React from 'react';
import LearningThroughPlay from '../../assets/images/learning-through-play.png';
import RewardingProgress from '../../assets/images/rewarding-progress.png';
import SupportiveCommunity from '../../assets/images/supportive-community.png';

function FeaturesSection() {
    return (
        <section className="flex flex-col items-center justify-center py-16 lg:flex-row lg:justify-between lg:items-center lg:px-52 md:px-12 sm:px-5 px-5" id="features-section">
            <ul className="w-full lg:w-auto">
                <li className="flex flex-col-reverse lg:flex-row gap-3 justify-between items-center mb-40">
                    <ul className="w-full lg:w-2/5 text-center lg:text-left">
                        <li><span className="bg-red-100 text-secondary rounded-full px-4 py-1 text-xs font-semibold">Learning Through Play</span></li>
                        <li><h2 className="font-bold text-4xl mt-2 mb-3 text-primary">Engage in interactive challenges</h2></li>
                        <li><p>Dive into our interactive query builder, where learning meets fun! Construct queries by dragging and dropping elements, selecting criteria, and seeing instant results. It's a hands-on approach to mastering concepts, making learning feel like a game.</p></li>
                    </ul>
                    <img src={LearningThroughPlay} alt="" className="w-1/2" />
                </li>
                <li className="flex flex-col lg:flex-row gap-3 justify-between items-center mb-40">
                    <img src={RewardingProgress} alt="" className="w-1/2" />
                    <ul className="w-full lg:w-2/5 text-center lg:text-left">
                        <li><span className="bg-red-100 text-secondary rounded-full px-4 py-1 text-xs font-semibold">Rewarding Progress</span></li>
                        <li><h2 className="font-bold text-4xl mt-2 mb-3 text-primary">See your skills grow as you learn</h2></li>
                        <li><p>Witness your progress firsthand with our achievement system. Unlock badges, levels, and milestones as you tackle challenges and complete tasks. Feel the rush of accomplishment as you see your skills improve and your profile flourish.</p></li>
                    </ul>
                </li>
                <li className="flex flex-col-reverse lg:flex-row gap-3 justify-between items-center mb-40">
                    <ul className="w-full lg:w-2/5 text-center lg:text-left">
                        <li><span className="bg-red-100 text-secondary rounded-full px-4 py-1 text-xs font-semibold">Supportive Community</span></li>
                        <li><h2 className="font-bold text-4xl mt-2 mb-3 text-primary">Connect and Help Each Other</h2></li>
                        <li><p>Join our vibrant community forum, where learners become mentors and friends. Share insights, ask questions, and lend a helping hand to fellow learners. It's a place to connect, collaborate, and grow together on your learning journey.</p></li>
                    </ul>
                    <img src={SupportiveCommunity} alt="" className="w-1/2" />
                </li>
            </ul>
        </section>
    );
}

export default FeaturesSection;