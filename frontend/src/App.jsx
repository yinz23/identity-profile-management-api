import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MyIdentities from './components/MyIdentities';
import ViewIdentity from './components/ViewIdentity';
import './App.css';

function App() {

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem('token')
  );

  const [page, setPage] = useState('dashboard');


  //show login page
  if (!loggedIn) {
    return (
      <Login
        onLogin={() => {
          setLoggedIn(true);
          setPage('dashboard');
        }}/>
    );
  }

  //show my identities page
  if (page === 'identities') {
    return (
      <MyIdentities
        onBack={() => setPage('dashboard')}/>
    );
  }


  //show view user identity page
  if (page === 'viewIdentity') {
    return (
      <ViewIdentity
        onBack={() => setPage('dashboard')}/>
    );
  }


  //show dashboard
  return (
    <Dashboard
      onMyIdentities={() => setPage('identities')}
      onViewIdentity={() => setPage('viewIdentity')}
      onLogout={() => {
        setLoggedIn(false);
        setPage('dashboard');
      }}/>
  );
}

export default App;
