import arrow from "../assets/arrow.svg";
import './adminHead.css';
import { Link } from "react-router-dom";
import TrennerAdmin from '../components/trennerAdmin';
import chat from "../assets/chat-svgrepo-com.svg"

export default function AdminHead(props) {
    return (
        <>
            <section className={'adminHeader'}>
                <Link to={'/'}>
                    <img src={arrow} alt={'arrow'} width={50} height={50}/>
                </Link>
                <div className={'div1'}>
                    {props.heading ? (
                        <h1 className="text">{props.heading}</h1>
                    ) : (
                        <button onClick={props.onClick} className="formButton" id={props.buttonID}>
                         Nutzer Blockieren
                        </button>

                    )}
                     <div className={'div1'}>
                    {props.showChat && (
                        <Link to="/chat" className="iconLink">
                            <img src={props.chatIcon} alt="chat" width={40} height={40} />
                            <p>{props.chatText}</p>
                        </Link>
                    )}
                </div>
                </div>
            </section>
            <TrennerAdmin className={'trenn'}></TrennerAdmin>
        </>
    );
}
