import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './media.css'
import CircularProgress from '@material-ui/core/CircularProgress'

function App() {
  const [text, setText] = useState('')
  const [gifs, setGifs] = useState([])
  const [loading, showLoading] = useState(false)

  async function getGifs(){
    showLoading(true)
    // console.log("Get information")
    const key = 'voimtxRjvTMO2LtI4kAD6xBDySCuplT1'
    let url = "https://api.giphy.com/v1/gifs/search?"
    url += 'api_key=' + key
    url += '&q=' + text
    /** Using await methods (or asynchronous methods) requires async methods */
    const r = await fetch(url)
    const body = await r.json()
    setGifs(body.data)
    setText('')
    showLoading(false)
  }

  console.log(gifs)

  return (
    <div className="App">
      <header className="App-header">
        <div className="input-wrap">
          {/** This is a text field component from material-ui */}
          <TextField id="outlined-basic" 
            label="Enter text" 
            fullWidth variant="outlined"
            value={text}
            onChange={e=> setText(e.target.value)}
            onKeyPress={e=>{
              if(e.key==='Enter') getGifs()
          }}/>
          {/** this is a button component from material-ui */}
          <Button variant="contained" color="primary"
            onClick={getGifs}>
            send
          </Button>
        </div>
      </header>
      <div className="gifs">
      <div className="loading">{loading && <CircularProgress/>}</div>
          {gifs.map((gif,i)=> <Gif key={i} {...gif}/>)}
      </div>
    </div>
  );
}

/** Gif Component */
function Gif({title, images}){
  return <div className="gif">
    <a href={images.fixed_height.url} target="_blank"><img src={images.fixed_height.url} onClick={images.fixed_height.url} /></a>
    <div className="gif-title">{title}</div>
  </div>

}

export default App;
