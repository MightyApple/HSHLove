import { Link } from "react-router-dom";
export default function Root() {
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
            </ul>
        </>
    )};