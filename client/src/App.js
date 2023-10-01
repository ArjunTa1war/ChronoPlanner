import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from './components/Navbar'
import Login from './components/login'
import Register from './components/register'
import Home from './components/Home';
import Alert from './components/Alert'

export default function App() {
  const [alert,setAlert] = React.useState(null);
  const showAlert = (message,type)=>{
    setAlert({
      msg:message,
      type:type
    })
    setTimeout(()=>{
      setAlert(null);
    },1500);
  }

  return (
    <>
      <Navbar showAlert={showAlert}/>
      <div style={{ position: 'absolute', right: '2%' }}>
       <Alert alert={alert} />
       </div>
      <Routes>
       <Route exact path="/" element = {<Home showAlert={showAlert}/>} />
       <Route exact path="/login" element = {<Login showAlert={showAlert}/>} />
       <Route exact path="/signup" element = {<Register showAlert={showAlert}/>} />
      </Routes>
    </>
  )
}

