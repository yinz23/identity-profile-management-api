import { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'http://localhost:5000/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('roleId', data.roleId);
      onLogin();

    } catch (error) {
      console.error(error);
      setMessage('Unable to connect to server');
    }
  };

  return (
    <div className="app">
      <h1>Identity & Profile Management System</h1>

      <div className="login-box">
        <h2>Login</h2>

        <form onSubmit={login}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>

          <button type="submit">Login</button>

          {message && (<p className="message">{message}</p>)}
        </form>
      </div>
    </div>
  );
}

export default Login;