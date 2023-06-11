import arrow from "../assets/arrow.svg";
import './adminHead.css';
import { Link } from "react-router-dom";
import Trenner from '../components/trenner';
import chat from "../assets/chat-svgrepo-com.svg"

export default function AdminHead(props) {
    return (
        <>
            <section className={'adminHeaderContainer'}>
                <div className={'adminHeader'}>
                    <Link to={'/admin'}>
                        <img src={arrow} alt={'arrow'} width={50} height={50}/>
                    </Link>
                    {props.heading ? (
                        <h1>{props.heading}</h1>
                    ) : (
                        <button onClick={props.onClick} className="formButton" id={props.buttonID}>
                            Nutzer Blockieren
                        </button>

                    )}
                    <div className={'chatIcon'}>
                        {props.showChat && (
                            <Link to="/chat" className="iconLink">
                                <img src={props.chatIcon} alt="chat" width={40} height={40} />
                                <p>{props.chatText}</p>
                            </Link>
                        )}
                    </div>
                </div>

                <Trenner></Trenner>
            </section>
        </>
    );
}
