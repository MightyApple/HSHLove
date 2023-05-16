import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage.js';
import RegisterPage from './components/RegisterPage.js';


function App() {
    return (
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/LoginPage">Login</Link>
            </li>
            <li>
              <Link to="/RegisterPage">Register</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/LoginPage" component={LoginPage} />
          <Route path="/RegisterPage" component={RegisterPage} />
        </Switch>
      </BrowserRouter>
    );
  }
  
  export default App;
  