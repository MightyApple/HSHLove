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
            </ul>
        </>
    )};