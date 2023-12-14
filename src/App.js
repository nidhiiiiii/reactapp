/* eslint-disable react/jsx-no-undef */
// import logo from './logo.svg';
import './App.css';
import React ,{useRef, useState} from 'react';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/analytics'
import 'firebase/compat/firestore'
import 'firebase/analytics';
// import 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { Timestamp } from 'firebase/firestore';

// require('dotenv').config();
firebase.initializeApp({
  // apiKey: "AIzaSyDSbztxt35uZJEBCt_NJswZr7OEas69d2c",
  // authDomain: "spill-tea.firebaseapp.com",
  // projectId: "spill-tea",
  // storageBucket: "spill-tea.appspot.com",
  // messagingSenderId: "165462082253",
  // appId: "1:165462082253:web:02a2f266984d5494785f84",
  // measurementId: "G-V5Q04BTW9R",
  // databaseURL:"https://spill-tea.firebaseio.com"
  apiKey:process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL:process.env.REACT_APP_FIREBASE_DATABASE_URL
})

const auth=firebase.auth();
const firestore=firebase.firestore();

function App() {
  const [user]=useAuthState(auth);//firebase will show who logged in 

  return (
    <div className="App">
      <header>
        <h1>welcome to ISE-A 2024</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
        {/*if the user is logged in then the user will not be not null , then we head to chatroom , else to signin*/}
      </section>
    </div>
  );
}
function SignIn(){
  const signInWithGoogle=()=>{
    const provider=new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <>
    <button className='sign-in' onClick={signInWithGoogle}>sign in</button>
    <p>welcome to the ise~A-2024</p>
    </>
  )
}
function SignOut(){
  return auth.currentUser &&(
    <button className='signout' onClick={()=>auth.signOut()}>signout</button>
  )
}
function ChatRoom(){
const dummy=useRef();
const messagesRef=firestore.collection('messages');
const query=messagesRef.orderBy('createdAt').limit(50);//when was the msg created order by time
const [messages]=useCollectionData(query,{idField:"id"})
const[formValue,setFormValue]=useState('');

const sendMessage = async(e)=>{
  //async await-promises 
  //async waits till the data is sent , here the messages should be displayed when its turn comes one by one
  //
  e.preventDefault();
  const{uid,photoURL}=auth.currentUser;
  await messagesRef.add({
    text: formValue,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),//inbuilt by firebase
    uid,
    photoURL
  })
  setFormValue('');
  dummy.current.scrollIntoView({behavior:'smooth'});
}
return(
  <>
  <main>
  {messages && messages.map(msg =><ChatMessage key ={msg.id} message ={msg}/>)}
  <span ref={dummy}></span>  
  </main> 
  {/* sending 2 variables which are called as props */}
  <div className='footer'>
  <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} placeholder='ask your doubts here..'/>
    <button type='submit' disabled={!formValue}>send</button>
  </form>
  </div>
  
  </>
)
}
//this has to print message
function ChatMessage(props){
  const{text,uid,photoURL,serverTimestamp}=props.message;
  const messageClass =uid === auth.currentUser.uid ?'sent':'recived'
  return(
    <>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='whois this'/>
      <p>{text}</p>
      {/* <p>{serverTimestamp}</p> */}
    </div>
    </>
  )
}


export default App;
