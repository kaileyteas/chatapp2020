import React, {useState, useEffect} from 'react';
import './App.css';
import { db, useDB } from './db'
import NamePicker from './namePicker'
import { BrowserRouter, Route } from 'react-router-dom'
import { FiSend, FiCamera } from 'react-icons/fi'
import Camera from 'react-snap-pic'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import "./media.css"

function App(){
  {/* This redirects the user to a localhost page called 'home' */}
  useEffect(()=>{
    const {pathname} = window.location
    if(pathname.length<2) window.location.pathname='home'
  },[])

  return <BrowserRouter>
    <Route path="/:room" component={Room}/>
  </BrowserRouter>
}

function Room(props) {
  // in usestate, we set messages to an empty array to show messages
  // while setMesages is a function
  // const [messages, setMessages] = useState([])
  const {room} = props.match.params
  const [name, setName] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const messages = useDB(room)

  /** This is a asynchronous method, meaning that it will wait until prompted
   *  You can use the wait method with async functions, but without declaring async,
   *  it will not work.
   */
  async function takePicture(img) {
    setShowCamera(false)
    const imgID = Math.random().toString(36).substring(7)
    var storageRef = firebase.storage().ref()
    var ref = storageRef.child(imgID + '.jpg')
    await ref.putString(img, 'data_url')
    db.send({ img: imgID, name, ts: new Date(), room })
  }

  return <main>
    
    {showCamera && <Camera takePicture={takePicture} />}

    <header className="header"> 
      <div className="logo-wrap">
        <img src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c541.png" 
        className="logo"
        />
      </div>
      Fresh memes
      <NamePicker onSave = {setName}/>
    </header>
    
    {/* returning HTML for a new message that is being sent to the chat */}
    <div className="messages">
      {messages.map((m,i)=> <Message key={i} m={m} name={name}/>)}
    </div>

    {/* messages -- the text we send to textinput*/}
    {/* the ... implies that we will append all new messages to the beginning of the list */}
    <TextInput 
      showCamera={()=>setShowCamera(true)}
      onSend={(text)=>{
        db.send({
          text, name, ts: new Date(), room
      })
    }}/>

  </main>
}

const bucket = 'https://firebasestorage.googleapis.com/v0/b/chatroom-e34eb.appspot.com/o/'
const suffix = '.jpg?alt=media'

function Message({m, name}){
  return <div className="message-wrap"
    from={m.name===name?'me':'you'}
    onClick={()=>console.log(m)}>
    <div className="message">
      <div className="msg-name">{m.name}</div>
      <div className="msg-text">{m.text}
      {m.img && <img src={bucket + m.img + suffix} alt="pic"/>}</div>
    </div>
  </div>
}

function TextInput(props){
  const [text, setText] = useState('')

  return <div className="text-input-wrap">
    <button onClick={props.showCamera}
      style={{left:10, right:'auto','border-radius':'5px'}}>
      <FiCamera style={{height:15, width:15}} />
    </button>
    <input 
      value={text}
      className="text-input"
      placeholder="Enter text"
      onChange={e=> setText(e.target.value)}
      onKeyPress={e=> {
        if(e.key==='Enter') {
          if(text) props.onSend(text)
          setText('')
        }
      }}
    />
    <button onClick={()=> {
      props.onSend(text)
      setText('')
      }}
      className="button"
      disabled={!text}
    >
    ↑
    </button>
  </div>
}

export default App;
