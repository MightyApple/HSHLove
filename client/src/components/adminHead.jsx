import arrow from "../assets/arrow.svg";
import './adminHead.css';
import { Link } from "react-router-dom";
import Trenner from '../components/trenner';

export default function AdminHead(props) {

    const disableUser = async (id) => {
        try {
            await fetch('/disableUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <section className={'adminHeaderContainer'}>
                <div className={'adminHeader'}>
                    <Link to={'/admin'} className={'arrowLink'}>
                        <img src={arrow} alt={'arrow'} width={50} height={50}/>
                    </Link>
                    {props.heading ? (
                        <h1>{props.heading}</h1>
                    ) : (
                        <button onClick={() => disableUser(props.id)} className="formButton blockButton" id={props.buttonID}>
                            Nutzer Blockieren
                        </button>
                    )}
                </div>

                <Trenner></Trenner>
            </section>
        </>
    );
}
