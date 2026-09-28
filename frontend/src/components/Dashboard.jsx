function Dashboard({ onLogout, onMyIdentities, onViewIdentity }) {

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roleId');

    onLogout();
  };

  return (
    <div className="dashboard">

      <h1>Welcome to Dashboard</h1>

      <div className="options">
        <button onClick={onMyIdentities}>My Identities</button>
        <button onClick={onViewIdentity}>View User Identity</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;