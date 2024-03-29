import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import {Footer, Header, Main, Input} from "./components/index"
import React from 'react';
import './index.css'

export function App (){

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api")
      .then((res) => {
        if (res.ok){
          return res.json()
        }
      }
        )
      .then((data) => setData(data.message));
      console.log('fetched data: ' + data);
  }, []);

  return (
    <div className="App">
  
        <Input/>
      
    </div>
  );
}

export default App;
  
