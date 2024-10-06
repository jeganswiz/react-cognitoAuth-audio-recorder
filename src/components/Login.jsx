import '../App.css';
import userPool from '../userPool';
import React, { useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

function Login({ setToken }) {
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(""); // Handle errors

  const { email, password } = data;

  const changeHandler = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = e => {
    e.preventDefault();
    setError(""); // Reset error

    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log("Login success:", data);
        const token = data.getIdToken().getJwtToken();
        setToken(token);
        localStorage.setItem('token', token); // Store token locally
      },
      onFailure: (err) => {
        setError(err.message || JSON.stringify(err)); // Show error
      },
    });
  };

  return (
    <div className="login-container">
      <center>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>} {/* Show error message */}
        <form onSubmit={submitHandler} className="login-form">
          <input
            type="text"
            name="email"
            value={email}
            placeholder="Enter Email"
            onChange={changeHandler}
          /><br/>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter Password"
            onChange={changeHandler}
          /><br/>
          <input type="submit" value="Login" />
        </form>
      </center>
    </div>
  );
}

export default Login;
