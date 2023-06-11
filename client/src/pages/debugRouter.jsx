import { Link, useNavigate } from "react-router-dom";
async function authorized() {
    return fetch('/authorized').then(response => response.json()).then(data => { //data ist das was der Server aus der DB zurückgibt
        return data; //returned von der fetch Funktion den ganzen User
    });
  }
export default function Root() {
    const navigate = useNavigate()
    let loggedIn= authorized()
    if(!loggedIn.loggedIn){
        navigate("/")
    }
    return (
        <>
            <ul>
                <li>
                    <Link to={'chat'}>Chat</Link>
                </li>
                <li>
                    <Link to={'homepage'}>Error</Link>
                </li>
                <li>
                    <Link to={'login'}>Login</Link>
                </li>
                <li>
                    <Link to={'registrieren'}>Registrieren</Link>
                </li>
                <li>
                    <Link to={'start'}>StartingPage (Später nur "/")</Link>
                </li>
                <li>
                    <Link to={'edit'}>Profil bearbeiten</Link>
                </li>
                <li>
                    <Link to={'match'}>Match Page</Link>
                </li>
                <li>
                    <Link to={'admin'}>Admin</Link>
                </li>
            </ul>
        </>
    )};