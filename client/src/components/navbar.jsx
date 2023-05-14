import logo from "../assets/logo.svg";
import chat from "../assets/chat-svgrepo-com.svg"
import profile from "../assets/person-remove-sharp-svgrepo-com.svg"

import './navbar.css'
import {Link} from "react-router-dom";
export default function Root() {
    return (
        <>
            <header>
                <nav className={'primaryContainer'}>
                    <Link to={'/chat'}>
                        <img src={chat} alt={'chat'} width={40} height={40}/>
                        <p>Chats</p>
                    </Link>
                    <Link to={'/'}>
                        <img src={logo} alt={'logo'} width={40} height={40}/>
                        <p>Finde neue Leute</p>
                    </Link>
                    <Link to={'/'}>
                        <img src={profile} alt={'profile'} width={40} height={40}/>
                        <p>Dein Profil</p>
                    </Link>
                </nav>
            </header>
        </>
    )};