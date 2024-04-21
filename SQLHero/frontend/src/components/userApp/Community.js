import React, { useState, useEffect } from 'react';
import Send from '../../assets/images/send.svg';
import DashboardNav from './UserDashboardNav';
import Alert from './Alert';

function Community() {
    const [help, setHelp] = useState('');
    const [posts, setPosts] = useState([]);
    const [reply, setReply] = useState('');
    const [replies, setReplies] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('/api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, help }),
            });
            const data = await response.json();    
            if (data.message === 'Post successful!') {
                console.log("successful");
                setHelp('');
                fetchPosts();
                setAlertMessage('Your post has been successfully submitted.');
            } else {
                console.error('Error updating user progress:', data.message);
            }
        } catch (err) {
            console.error('Error during API call:', err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []); 

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/fetch-posts', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setPosts(data);
            fetchReplies();
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleReplySubmit = async (e, parentId) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch('/api/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, reply, parentId }),
            });
            const data = await response.json();    
            if (data.message === 'Reply successful!') {
                setReply('');
                fetchPosts();
            } else {
                console.error('Error adding reply:', data.message);
            }
        } catch (err) {
            console.error('Error during API call:', err);
        }
    };

    const fetchReplies = async () => {
        try {
            const response = await fetch(`/api/fetch-replies`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setReplies(data);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const getTimeDifference = (createdAt) => {
        const currentTime = new Date();
        const postTime = new Date(createdAt);
        const timeDifference = currentTime - postTime;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        if (days > 0) {
            return `${days} day${days === 1 ? '' : 's'} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        } else {
            return 'Just now';
        }
    }

    return (
        <main className='flex flex-row relative'>
            {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
            <DashboardNav />
            <section className='px-10 py-10 lg:ms-64 lg:w-2/3 w-full'>
                <form className="rounded-lg w-full bg-white border px-3 py-2 relative" onSubmit={handlePostSubmit}>
                    <input 
                        type="text" 
                        name="help-content" 
                        placeholder="Ask for help" 
                        className="border-0 bg-transparent focus:ring-0 w-full" 
                        value={help} 
                        onChange={(e) => setHelp(e.target.value)}
                        autoComplete='off' 
                        />
                    <button type="submit" className={`absolute right-0 top-0 me-3 mt-2 ${help ? '' : 'opacity-50'}`} disabled={!help}>
                        <img src={Send} alt="send" className="w-10"/>
                    </button>
                </form>
                <ul className="mt-10">
                    {posts.data && posts.data.length > 0 && (
                        <>
                            {posts.data.map((post) => (
                                <li key={post.id} className="p-6 bg-white border border-gray-200 rounded-lg mb-5">
                                    <div className='flex items-center'>
                                        {post.picture ? (
                                            <img src={require(`../../assets/images/${post.picture}`)} alt={post.username} className='w-16 rounded-full' />
                                        ) : (
                                            <div className="profile-picture size-16 rounded-full flex justify-center items-center font-bold text-3xl bg-yellow-100 text-yellow-500">
                                                {post.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="ms-3">
                                            <p className='font-bold text-lg'>{post.username}</p>
                                            <p className="text-sm text-gray-500">{getTimeDifference(post.created_at)}</p>
                                        </div>
                                    </div>
                                    <p className="mt-3">{post.content}</p>
                                    {replies.data && replies.data.length > 0 && (
                                        <>
                                            {replies.data.filter((reply) => reply.post_id === post.id).map((reply) => (
                                                <div key={reply.id} className="reply ms-16 mt-3">
                                                    <div className='flex items-center'>
                                                    {reply.picture ? (
                                                        <img src={require(`../../assets/images/${reply.picture}`)} alt={reply.username} className='w-16 rounded-full' />
                                                    ) : (
                                                        <div className="profile-picture size-16 rounded-full flex justify-center items-center font-bold text-3xl bg-yellow-100 text-yellow-500">
                                                            {reply.username.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                        <div className="ms-3">
                                                            <p className='font-bold text-lg'>{reply.username}</p>
                                                            <p className="text-sm text-gray-500">{getTimeDifference(reply.created_at)}</p>
                                                        </div>
                                                    </div>
                                                    <p className="mt-3">{reply.content}</p>
                                                </div>   
                                            ))}
                                        </>                          
                                    )}
                                    <form className="mt-5 relative" onSubmit={(e) => handleReplySubmit(e, post.id)}>
                                        <input 
                                            type="text" 
                                            name="reply-content" 
                                            placeholder="Write a reply" 
                                            className="border-0 focus:ring-0 w-full bg-gray-100 rounded-lg"
                                            value={reply} 
                                            onChange={(e) => setReply(e.target.value)}                     
                                            autoComplete='off' 
                                        />
                                        <button type="submit" className={`${reply ? '' : 'opacity-50'}`} disabled={!reply}><img src={Send} alt="send" className="w-8 absolute right-3 top-1"/></button>
                                    </form>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </section>
        </main>
    );
}

export default Community;
