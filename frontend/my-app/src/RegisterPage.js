import React, { useState } from "react";
import "./register.css";

function RegisterPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };




  return (
    <div>
      <img id="logo" src={require("./images/Herz.png")} alt="Logo" />
      <h1>Registrieren</h1>
      <p>Erstelle ein neues Konto</p>
      <form>
        <input type="email" id="email" name="email" placeholder="E-Mail" />
        <div className="password-container">
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Passwort"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? "Verstecken" : "Anzeigen"}
          </button>
        </div>
        <input
          type={passwordVisible ? "text" : "password"}
          id="confirm-password"
          name="confirm-password"
          placeholder="Passwort bestätigen"
        />
        <label htmlFor="remember">
          <input type="checkbox" id="remember" name="remember" />
          Eingeloggt bleiben
        </label>
        <button type="submit" id="register-button">
          Registrieren
        </button>
      </form>
      <a href="#" id="forgot-password">
        Passwort vergessen?
      </a>
      <p id="register-link">
        Bereits ein Account?  
      </p>
  
    </div>
  );
}

export default RegisterPage;
