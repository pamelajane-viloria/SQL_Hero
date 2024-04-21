import React from 'react';
import LandingNav from './LandingNav';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import Footer from './Footer';

function LandingPage() {
    return (
        <>
            <LandingNav />
            <main>
                <HeroSection />
                <FeaturesSection />
            </main>
            <Footer />
        </>
    );
}

export default LandingPage;