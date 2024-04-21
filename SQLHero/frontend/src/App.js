import React from 'react';
import LandingPage from './components/landing/LandingPage';
import RegisterPage from './components/auth/Register';
import LoginPage from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute'; // Assuming UserDashboard renders the navigation
import UserDashboard from './components/userApp/UserDashboard';
import Challenges from './components/userApp/Challenges';
import Community from './components/userApp/Community';
import Profile from './components/userApp/Profile';
import Game from './components/userApp/Game';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/css/style.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard/*" element={<PrivateRoute />} />
                    <Route path="/dashboard/home" element={<UserDashboard />} />
                    <Route path="/dashboard/challenges" element={<Challenges />} />
                    <Route path="/dashboard/community" element={<Community />} />
                    <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/game/:levelId" element={<Game />} />
            </Routes>
        </Router>
    );
}

export default App;
