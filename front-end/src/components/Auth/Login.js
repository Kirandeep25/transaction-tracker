import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', { username, password });
            if (response.status === 200) {
                
                localStorage.setItem('token', response.data.accessToken);
                localStorage.setItem('username', username); 
                onLogin(username); 
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setErrorMessage('Invalid credentials');
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
        <div className="card p-4 shadow-lg" style={{ width: '800px' }}>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Login</h2>
            <div className="form-group mb-3">
              <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            </div>
            <div className="form-group mb-3">
              <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>  
    );
};

export default Login;
