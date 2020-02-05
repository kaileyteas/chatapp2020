import React, {useState} from 'react';
import './App.css';

function App() {
  // in usestate, we set messages to an empty array to show messages
  // while setMesages is a function
  const [messages, setMessages] = useState([])
  return <main>
    
    <header className="header"> 
      <img src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c541.png" 
      className="logo"
      />
      Fresh memes
    </header>

    {/* returning HTML for a new message that is being sent to the chat */}
    <div classname="messages">
      {messages.map((m,i)=>{
        return <div key={i} className="message-wrap">
          <div className="message"> {m}</div>
        </div>
      })}
    </div>

    {/* messages -- the text we send to textinput*/}
    {/* the ... implies that we will append all new messages to the beginning of the list */}
    <TextInput onSend={(text)=>{
      setMessages([...messages, text])
    }}/>

  </main>
}

function TextInput(props){
  const [text, setText] = useState('')

  return <div className="text-input-wrap">
    <input 
      value={text}
      className="text-input"
      placeholder="Enter text"
      onChange={e=> setText(e.target.value)}
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
