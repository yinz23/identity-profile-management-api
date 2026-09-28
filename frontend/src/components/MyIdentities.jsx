import { useEffect, useState } from 'react';

function MyIdentities({ onBack }) {
  const [identities, setIdentities] = useState([]);
  const [identityType, setIdentityType] = useState('preferred');
  const [identityName, setIdentityName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editType, setEditType] = useState('');
  const [editName, setEditName] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  //get identities
  const getIdentities = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/identity/me',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIdentities(data.identities);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Unable to retrieve identities');
    }
  };

  useEffect(() => {getIdentities();}, []);

  //create identity
  const createIdentity = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'http://localhost:5000/api/identity',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            identityType,
            identityName
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setIdentityName('');
      await getIdentities();
      setMessage('Identity created successfully');

    } catch (error) {
      console.error(error);
      setMessage('Unable to create identity');
    }
  };

  //edit identity
  const editIdentity = (identity) => {
    setEditId(identity.identity_id);
    setEditType(identity.identity_type);
    setEditName(identity.identity_name);
  };

  //update identity
  const updateIdentity = async (identityId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/identity/${identityId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            identityType: editType,
            identityName: editName
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setEditId(null);
      await getIdentities();
      setMessage('Identity updated successfully');

    } catch (error) {
      console.error(error);
      setMessage('Unable to update identity');
    }
  };

  //delete identity
  const delIdentity = async (identityId) => {
    if (!window.confirm('Delete this identity?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/identity/${identityId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      await getIdentities();
      setMessage('Identity deleted successfully');

    } catch (error) {
      console.error(error);
      setMessage('Unable to delete identity');
    }
  };

  return (
    <div className="identities">
      <h1>My Identities</h1>
      {message && <p>{message}</p>}

      <div className="new-identity">
        <h2>Create Identity</h2>

        <form onSubmit={createIdentity}>
          <select
            value={identityType}
            onChange={(e) => setIdentityType(e.target.value)}>
            <option value="preferred">Preferred</option>
            <option value="academic">Academic</option>
            <option value="legal">Legal</option>
          </select>

          <input
            type="text"
            placeholder="Identity name"
            value={identityName}
            onChange={(e) => setIdentityName(e.target.value)}
            required/>

          <button type="submit">Create</button>
        </form>
      </div>

      <h2>Existing Identities</h2>

      {identities.length === 0 ? (
        <p>No identities found.</p>
      ) : (
        identities.map((identity) => (
          <div
            className="id-card"
            key={identity.identity_id}>

            {editId === identity.identity_id ? (
              <>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}>
                  <option value="preferred">Preferred</option>
                  <option value="academic">Academic</option>
                  <option value="legal">Legal</option>
                </select>

                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}/>

                <button onClick={() =>updateIdentity(identity.identity_id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{identity.identity_type}</h3>
                <p>{identity.identity_name}</p>

                <button onClick={() => editIdentity(identity)}>Edit</button>
                <button onClick={() =>delIdentity(identity.identity_id)}>Delete</button>
              </>
            )}

          </div>
        ))
      )}

      <button onClick={onBack}>Back to Dashboard</button>
    </div>
  );
}

export default MyIdentities;