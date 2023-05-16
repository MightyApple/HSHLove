import React, { useState } from "react";
import "./first.css";
import Herz from "./images/Herz.png";


const ImageUploader = () => {
  const [images, setImages] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({ studium: "", geschlecht: "" });

  const handleImageChange = (e) => {
    const newImages = [...images];
    for (let i = 0; i < e.target.files.length; i++) {
      newImages.push(e.target.files[i]);
    }
    setImages(newImages);
    console.log(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    console.log(newImages);
  };
  const studiumOptions = [
    "Informatik",
    "Medizin",
    "Wirtschaftswissenschaften",
    "Elektrotechnik",
    "Jura",
  ];
  
  const geschlechtOptions = ["männlich", "weiblich", "divers"];
  

  const handleDropdownChange = (event) => {
    const { name, value } = event.target;
    setSelectedOptions(prevState => ({ ...prevState, [name]: value }));
    console.log(selectedOptions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(selectedOptions);
  };
  
  return (
    <div>
      <nav>
        <ul className="top-bar-nav-list">
          <li>
            <a href="#" className="nav-link" />
          </li>
          <li>
            <a href="#" className="nav-link">
              <img src={Herz} alt="Logo" className="logo" />
            </a>
          </li>
          <li>
            <a href="#" className="nav-link" />
          </li>
        </ul>
      </nav>
      <div className="container">
        <div className="input-container">
          <div className="input-field">
            <h2 className="input-label">Was ist dein Vorname?</h2>
            <input type="text" name="Vorname" className="input-text" />
          </div>
          <div className="input-field">
            <h2 className="input-label">Geburtsdatum</h2>
            <input type="date" className="input-date" />
          </div>
        </div>
        <div className="container_bild">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="uploaded-image-container">
                <img src={URL.createObjectURL(image)} alt="uploaded" className="uploaded-image" />
                <button onClick={() => handleRemoveImage(index)} className="remove-image-button">
                  Bild entfernen
                </button>
              </div>
            ))
          ) : (
            <div className="placeholder_bild">
              <label htmlFor="file-upload" className="custom-file-upload">
                <i className="fa fa-cloud-upload"></i> Bild hinzufügen
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleImageChange}
                className="image-upload"
                multiple
              />
            </div>
          )}
        </div>
        <div className="description">
          <h2 className="description-input">Beschreibung</h2>
          <textarea className="description-textarea"></textarea>
        </div>
        <div className="tags-container">
          <div className="tags">
            <h2 className="tags-label">Tags</h2>
          </div>
          <div className="search">
            <h2 className="search-label">Ich suche nach:</h2>
          </div>
        </div>
        <hr className="input-group" />
        <div className="dropdown-container">
          <div className="dropdown1">
            <h3 className="dropname1">Ich studiere:</h3>
            <select className="dropdown-select" onChange={handleDropdownChange}>
              {studiumOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="dropdown1">
            <h3 className="dropname1">Ich bin:</h3>
            <select className="dropdown-select" onChange={handleDropdownChange}>
              {geschlechtOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="submit-button">Speichern</button>
      </div>
    </div>
  );
  
}

export default ImageUploader;
