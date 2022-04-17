import React from 'react';
import './App.css';
import {OpenAPI} from "./generated";
import {PLAYER_ID} from "./constants";
import { v4 as uuid } from 'uuid'
import InsiderComponent from "./Components/InsiderComponent";

function App() {
  OpenAPI.BASE = 'http://192.168.0.171:3000';
  if(!localStorage.getItem(PLAYER_ID)) {
    localStorage.setItem(PLAYER_ID, uuid())
  }

  return (
    <div className="App">
      <InsiderComponent />
    </div>
  );
}

export default App;
