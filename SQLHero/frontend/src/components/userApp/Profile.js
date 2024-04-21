import React, { useState, useEffect } from 'react';
import DashboardNav from './UserDashboardNav';
import Edit from '../../assets/images/pencil.svg';
import Alert from './Alert';

function Settings() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [newPasswordError, setNewPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [file, setFile] = useState();    
    const [alertMessage, setAlertMessage] = useState(null);

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
                    setUsername(data.user.username);
                    setEmail(data.user.email);
                    setFile(data.user.picture);
                } else {
                    console.error('Error fetching user data:', data.message);
                }
            } catch (err) {
                console.error('Error during API call:', err);
            }
        };
        fetchUserData();  
    }, []);
    
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('/api/update-profile ', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, username, email }),
            });
            const data = await response.json();    
            if (data.success) {
                setAlertMessage('Your information has been successfully updated.');
            } else {
                console.error('Error updating user:', data.message);
            }
        } catch (err) {
            console.error('Error during API call:', err);
        }    
    };

    const validateNewPassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        } 
        return null;
    };
    
    const validateConfirmPassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return 'Passwords do not match.';
        }
        return null;
    };

    const validatePasswordChange = async() => {
        const errors = {};
        const newPasswordError = validateNewPassword(newPassword);
        const confirmPasswordError = validateConfirmPassword(newPassword, confirmNewPassword);

        if (newPasswordError) {
            errors.newPassword = newPasswordError;
        }
        if (confirmPasswordError) {
            errors.confirmPassword = confirmPasswordError;
        }
        return errors;
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const errors = await validatePasswordChange();

        setNewPasswordError(errors.newPassword || null);
        setConfirmPasswordError(errors.confirmPassword || null);
    
        if (Object.keys(errors).length > 0) {
            return;
        }

        const response = await fetch('/api/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword }),
        });

        try {
            const data = await response.json();
            if (data.success) {
                setAlertMessage('Your password has been successfully updated.');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                setErrorMessage(data.message);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Internal server error!');
        }
    };

    const handleFileChange = async (e) => {
        const token = localStorage.getItem('authToken');
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        formData.append('profilePicture', selectedFile);
        
        const response = await fetch('/api/change-picture', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
      
        try {
            const data = await response.json();
            if (data.success) {
                setFile(data.imagePath);
                setAlertMessage('Your profile picture has been updated successfully.');
            } else {
                setErrorMessage(data.message);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Internal server error!');
        }
    };

    const defaultProfileImage = username ? username.charAt(0).toUpperCase() : '';

    return (
        <main className='flex flex-row relative'>
            {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
            <DashboardNav />
            <section className='px-10 py-10 lg:ms-64 lg:w-2/3 w-full'>
                <h1 className='text-xl font-bold'>Settings</h1>
                <h2 className="text-2xl font-bold mt-10 border-b-2 pb-2">Edit Profile</h2>
                <div className='mt-5 relative inline-block'>
                    <label htmlFor="profile-picture" className="edit-profile-picture">
                        {file ? (
                            <img src={require(`../../assets/images/${file}`)} className='w-24 rounded-full' alt='Profile Picture' />
                        ) : (
                            <div className="profile-picture size-24 rounded-full flex justify-center items-center font-bold text-3xl bg-yellow-100 text-yellow-500">
                                {defaultProfileImage}
                            </div>
                        )}
                        <img src={Edit} alt='edit profile picture' className='w-6 absolute bg-stone-900/75 rounded-full bottom-0 right-0 cursor-pointer' />
                    </label>
                    <input id="profile-picture" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>        
                <form className="mt-5 w-1/2" onSubmit={handleProfileUpdate}>
                    <ul>
                        <li className="mb-5">
                            <label htmlFor="username" className="block mb-2 font-medium">Username</label>
                            <input 
                                type="text" 
                                className="text-sm  border border-gray-300 rounded-lg bg-white focus:border-primary block w-full p-2.5" 
                                placeholder='Enter your username here' 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete='off' 
                                />
                        </li>
                        <li className="mb-5">
                            <label htmlFor="username" className="block mb-2 font-medium">Email</label>
                            <input 
                                type="email" 
                                className="text-sm  border border-gray-300 rounded-lg bg-white focus:border-primary block w-full p-2.5" 
                                placeholder='Enter your email here' 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete='off' 
                                />
                        </li>
                    </ul>
                    <button type="submit" className="custom-btn">Update</button>
                </form>
                <h2 className="text-2xl font-bold mt-10 border-b-2 pb-2">Change Password</h2>
                <form className="my-5 w-1/2" onSubmit={handlePasswordChange}>
                    <ul>
                        <li className="mb-5">
                            <label htmlFor="username" className="block mb-2 font-medium">New Password</label>
                            <input 
                                type="password" 
                                className="text-sm  border border-gray-300 rounded-lg bg-white focus:border-primary block w-full p-2.5" 
                                placeholder='Enter your old password here' 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete='off' 
                                />
                            {newPasswordError && <p className="error-message">{newPasswordError}</p>}
                        </li>
                        <li className="mb-5">
                            <label htmlFor="username" className="block mb-2 font-medium">Confirm New Password</label>
                            <input 
                                type="password" 
                                className="text-sm  border border-gray-300 rounded-lg bg-white focus:border-primary block w-full p-2.5" 
                                placeholder='Enter your old password here' 
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                autoComplete='off' 
                                />
                            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                        </li>
                    </ul>
                    <button type="submit" className="custom-btn">Update Password</button>
                </form>
            </section>
        </main>
    );
}

export default Settings;
