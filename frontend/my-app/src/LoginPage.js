import React from "react";
import './login.css';



class LoginPage extends React.Component {
  render() {
    return (
      <div>
        <img
          id="logo"
          src={require("./images/Herz.png")}
          alt="Logo"
        />
        <h1>Login</h1>
        <p>Melde dich mit deinen Daten deiner Registration an</p>
        <form>
          <input type="email" id="email" name="email" placeholder="E-Mail" />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Passwort"
          />
          <label htmlFor="remember">
            <input
              type="checkbox"
              id="remember"
              name="remember"
            />
            Eingeloggt bleiben
          </label>
          <button type="submit" id="login-button">
            Login
          </button>
        </form>
        <a href="#" id="forgot-password">
          Passwort vergessen?
        </a>
        <p id="register-link">
        
        </p>
      </div>
    );
  }
}

export default LoginPage;

