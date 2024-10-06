import '../App.css';
import userPool from '../userPool';
import React, { useState } from 'react';
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';

function Signup() {
  const [data, setData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    name: "",
    verificationCode: ""
  });
  
  const [formStage, setFormStage] = useState("signup"); // Tracks the form stage (signup or verification)
  const [error, setError] = useState(""); // For error messages
  const [success, setSuccess] = useState(false); // For showing success message

  const { email, password, phoneNumber, name, verificationCode } = data;

  const changeHandler = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Sign-up form submission handler
  const submitHandler = e => {
    e.preventDefault();
    setError(""); // Reset error messages

    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      }),
      new CognitoUserAttribute({
        Name: 'phone_number',
        Value: phoneNumber
      }),
      new CognitoUserAttribute({
        Name: 'name',
        Value: name
      }),
    ];

    userPool.signUp(email, password, attributeList, null, (err, data) => {
      if (err) {
        setError(err.message || JSON.stringify(err)); // Set error message
      } else {
        console.log(data);
        setFormStage("verification"); // Show the verification form
      }
    });
  };

  // OTP verification handler
  const verifyCodeHandler = e => {
    e.preventDefault();
    setError("");

    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    user.confirmRegistration(verificationCode, true, (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err)); // Show error
      } else {
        setSuccess(true); // Show success message
        console.log(result);
      }
    });
  };

  return (
    <div className="signup-container">
      <center>
        <h2>Signup</h2>
        {error && <div className="error-message">{error}</div>} {/* Show error message */}
        
        {formStage === "signup" && !success && (
          <form onSubmit={submitHandler} className="signup-form">
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Enter Name"
              onChange={changeHandler}
            />
            <br/>
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Enter Email"
              onChange={changeHandler}
            />
            <br/>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter Password"
              onChange={changeHandler}
            />
            <br/>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              placeholder="Enter Phone number"
              onChange={changeHandler}
            />
            <br/>
            <input type="submit" value="Signup" />
          </form>
        )}

        {formStage === "verification" && !success && (
          <form onSubmit={verifyCodeHandler} className="otp-form">
            <input
              type="text"
              name="verificationCode"
              value={verificationCode}
              placeholder="Enter Verification Code"
              onChange={changeHandler}
            />
            <br/>
            <input type="submit" value="Verify" />
          </form>
        )}

        {success && (
          <div className="success-message">
            <h3>User created successfully!</h3>
            <img src="/success-image.png" alt="Success" />
          </div>
        )}
      </center>
    </div>
  );
}

export default Signup;
