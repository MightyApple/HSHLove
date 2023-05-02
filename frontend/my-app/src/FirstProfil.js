import React, { useState } from "react";
import './first.css';
import Herz from './images/Herz.png';



    
function FirstProfil() {
  return (
    <div>
     <nav>
  
     <ul className="top-bar-nav-list">
          <li>
            <a href="#" >
              
            </a>
          </li>
          <li>
            <a href="#">
              <img src={Herz} alt="Logo"  className="logo"/>
            </a>
          </li>
          <li>
            <a href="#">
              
            </a>
          </li>
        </ul>
  
  </nav>
      <div className="container">
        <div className="placeholder">
          Placeholder
          <button>Hinzufügen</button>
        </div>
        <div className="description">
          <h2>Beschreibung</h2>
          <textarea></textarea>
        </div>
        <div className="tags-container">
          <div className="tags">
            <h2>Tags</h2>
          </div>
          <div className="search">
            <h2>Ich suche nach:</h2>
          </div>
        </div>
        <hr />
     
        <div className="dropdown-container">
            <h3 className="dropname1">Ich studiere:</h3>
          <div className="study-dropdown">
            
            <select className="select">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
          <h3 className="dropname2"> Ich bin:</h3>
          <div className="status-dropdown">
            
            <select className="select">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
        </div>
        <button className="submit-button">Profil bestätigen</button>
      </div>
    </div>
  );
}

export default FirstProfil;
