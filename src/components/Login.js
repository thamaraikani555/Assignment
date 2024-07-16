import React, { useState } from 'react';
import '../css/LogScreen.css';
import { useSelector, useDispatch } from "react-redux";
import { loginMethod } from "../store/slices/authSlice";
import { useNavigate  } from 'react-router-dom';

const LoginScreen = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setData] =  useState({ userName: '', password: '' });
  const [formValidationError, setFormValidation] = useState(true);
  const [errors, setErrors] = useState({ userName: ''});

  const [isButtondisabled, setButton] = useState(false)
  const authToken = localStorage.getItem('authToken');
  const isAuthenticated = authToken && authToken !== "undefined" && authToken !== "null";
  if (isAuthenticated) {
    window.location.href = window.location.origin + '/generate-link';
  }

  const handleChange = async (e) => {
    e.preventDefault()
    const { name, value } = e.target;
    await setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let newErrors = {};
    if (!formData.userName) {
      newErrors.userName = 'User Name is required';
      setFormValidation(false)
    }else {
      setFormValidation(true)
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      setFormValidation(false)
    }else {
      setFormValidation(true)
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) { 
        dispatch( loginMethod(formData, navigate));
    }

  }

  return (
    <div className="login-container">
      <div className="login-box">
        <form>
          <div className="input-group">
            <input type="text" name='userName' value={ formData.userName} onChange={handleChange}  placeholder="Enter Your Email / Phone"/>
          </div>
          <div className="input-group">
            <input type="password" name='password' value={ formData.password} onChange={handleChange} placeholder="Password"/>
          </div>
          <button type="submit" disabled={isButtondisabled} onClick={handleFormSubmit} >Login</button>
        </form>
        <div className="links">
          <a href="#">Forgot your password?</a>
          <a href="#">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;