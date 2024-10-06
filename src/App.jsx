import React, { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import userPool from './userPool';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("login");

  useEffect(() => {
    const currentUser = userPool.getCurrentUser();

    if (currentUser) {
      localStorage.setItem('userId', currentUser.username);
    }
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setPage("home");
    }
  }, []);

  const handleLogout = () => {
    const currentUser = userPool.getCurrentUser();

    if (currentUser) {
      console.log("currentUser", currentUser);
      
      currentUser.signOut();
    }

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setPage("login");
  };


  return (
    <div>
      <nav>
        <div className="logo">IntechHub</div>
        <ul>
          {!token ? (
            <>
              <li>
                <button onClick={() => setPage("signup")}>Signup</button>
              </li>
              <li>
                <button onClick={() => setPage("login")}>Login</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={() => setPage("home")}>Home</button>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="container">
        {!token ? (
          <>
            {page === "login" ? (
              <Login setToken={setToken} />
            ) : (
              <Signup />
            )}
          </>
        ) : (
          <Home />
        )}
      </div>
    </div>
  );
}

export default App;
