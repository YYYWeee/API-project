// frontend/src/components/LoginFormPage/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useEffect } from "react";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disable,setDisable] = useState(true)


  const Demo = (e) => {
    e.preventDefault()
    return dispatch(sessionActions.login({ credential:"demo@user.io", password:"password" }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
}


useEffect(()=>{
  let disableButton = false

  if (credential.length < 4  || password.length < 6) disableButton = true;
  setDisable(disableButton)

})


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };



  return (
    <>
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={disable}>Log In</button>
        <button className="login-demoUser"  type="demo"  onClick={Demo}>Demo User</button>
      </form>
    </>
  );
}

export default LoginFormModal;
