import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import './App.css';
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    isValid: false,
    existingUser: false,
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
     firebase.auth().signInWithPopup(provider)
     .then(res => {
        const {displayName, photoURL, email} = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(signedInUser);
     })
     .catch(err => {
       console.log(err);
     })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
       const signedOutUser = {
         isSignedIn: false,
         name: '',
         email: '',
         photo: '',
       }
       setUser(signedOutUser);
       console.log(res);
    })
    .catch(err => {

    })
  }
  const is_valid_email = (email) => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = event => {
    const createdUser = { ...user };
    createdUser.existingUser = event.target.checked;
    setUser(createdUser);
  }
  const handleChange = event => {
    const newUserInfo = {
      ...user,
    }
    //debugger;
    let isValid = true;
    if(event.target.name === 'email'){
      isValid = is_valid_email(event.target.value);
    }
    if(event.target.name === 'password' && isValid){
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }
    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err);
        const createdUser = { ...user };
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset(); // reset the form
  }
  const signInUser = event => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }
    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="App">
    {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
         <button onClick={handleSignIn}>Sign In</button> 
        
    }       
    {
         user.isSignedIn && <div>
          <p> Welcome,  {user.name} </p>
          <p>Your email: {user.email}</p>
          <img src={user.photo}></img>
         </div>
    }
    <h1>Our Own Authentication</h1>
    <label htmlFor="switchForm"> Returning User
        <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm" />
    </label>
      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter your email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password" required />
        <br />
        <input type="submit" value="signIn" />
      </form>
      <form style={{ display: user.existingUser ? 'none' : 'block' }} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter Your Name" required />
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Enter your email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password" required />
        <br />
        <input type="submit" value="Create Account"/>
    </form>
    {
      user.error && <p style={{color:"red"}}>{user.error}</p>
    }
    </div>
  );
}

export default App;
