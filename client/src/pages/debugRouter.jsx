import { Outlet, Link } from "react-router-dom";
export default function Root() {
    return (
        <>
            <ul>
                <li>
                    <Link to={'chat'}>Chat</Link>
                </li>
                <li>
                    <Link to={'homepage'}>Homepage</Link>
                </li>
                <li>
                    <Link to={'login'}>Login</Link>
                </li>
                <li>
                    <Link to={'registrieren'}>Registrieren</Link>
                </li>
            </ul>
        </>
    )};