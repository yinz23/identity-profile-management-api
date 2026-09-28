import { useState } from 'react';

function ViewIdentity({ onBack }) {
  const [userId, setUserId] = useState('');
  const [identities, setIdentities] = useState([]);
  const [message, setMessage] = useState('');

  const search = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://localhost:5000/api/identity/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setIdentities([]);
        setMessage(data.message);
        return;
      }

      setIdentities(data.identities);
      setMessage('');

    } catch (error) {
      console.error(error);
      setMessage('Unable to retrieve identity');
    }
  };

  return (
    <div className="id-view">
      <h1>View User Identity</h1>

      <form onSubmit={search}>
        <label>User ID</label>
        <input
          type="number"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required/>

        <button type="submit">Search</button>
      </form>

      {message && <p>{message}</p>}

      <div className="id-list">
        {identities.map((identity) => (
          <div
            className="id-card"
            key={identity.identity_id}>
            <h3>{identity.identity_type}</h3>
            <p>{identity.identity_name}</p>
          </div>
        ))}
      </div>

      <button onClick={onBack}>Back to Dashboard</button>
    </div>
  );
}

export default ViewIdentity;