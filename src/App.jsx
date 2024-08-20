import React, { useState } from 'react';
import LoginForm from './components/Login';
import RegisterForm from './components/Register';
import BusinessSearch from './components/BusinessSearch';
import EmailForm from './components/EmailForm';
import './app.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  return (
    <div className='container'>
      <center><h1>Business Search</h1></center>
      {!user ? (
        <>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
          <RegisterForm />
        </>
      ) : (
        <>
          <EmailForm />
          <BusinessSearch />
          
        </>
      )}
    </div>
  );
}

export default App;
