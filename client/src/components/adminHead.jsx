import arrow from "../assets/arrow.svg";
import './adminHead.css';
import { Link } from "react-router-dom";
import TrennerAdmin from '../components/trennerAdmin';

export default function AdminHead(props) {
    return (
        <>
            <section className={'adminHeader'}>
                <Link to={'/'}>
                    <img src={arrow} alt={'arrow'} width={50} height={50}/>
                </Link>
                <div className={'div1'}>
                <h1 className="text">{props.heading}</h1>
     
                </div>
               
            </section> <TrennerAdmin className={'trenn'}></TrennerAdmin>
        </>
    );
}

