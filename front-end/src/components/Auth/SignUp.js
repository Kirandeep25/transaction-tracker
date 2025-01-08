import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/auth/signup', { username, password });
            if (response.status === 201) {
                navigate('/login'); // Redirect to login page after successful signup
            }
        } catch (error) {
            console.error('Signup failed:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2 className="mt-4">Sign Up</h2>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
