import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get the username from localStorage or set it as 'Guest'
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:8000/api/auth/logout', {
                data: { token },
            });
            localStorage.removeItem('token'); // Clear the token from local storage
            localStorage.removeItem('username'); // Clear the username from local storage
            setUsername(''); // Update username state
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="container text-center mt-5">
            <div className="card p-4 shadow-lg">
                <h1 className="mb-3">Welcome to the Expense Tracker</h1>
                {username ? (
                    <h4 className="text-secondary mb-4">Hello, {username}!</h4>
                ) : (
                    <h4 className="text-secondary mb-4">Hello, Guest!</h4>
                )}
                <p className="mb-4">Please choose an option:</p>
                <div className="d-flex justify-content-center gap-3">
                    {!username && (
                        <>
                            <Link to="/signup" className="btn btn-primary">
                                Sign Up
                            </Link>
                            <Link to="/login" className="btn btn-success">
                                Login
                            </Link>
                        </>
                    )}
                    {username && (
                        <button onClick={handleLogout} className="btn btn-danger">
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
