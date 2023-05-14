import logo from "../assets/logo.svg";
import './loginHead.css';
import {Link} from "react-router-dom";

export default function Root(props) {
    return (
        <>
            <section className={'formLogin'}>
                <Link to={'/'}>
                    <img src={logo} alt={'logo'} width={50} height={50}/>
                </Link>
                <div className={'normalFontSize'}>
                    <h1 className={'bigHeadline'}>{props.headline}</h1>
                    <h2>{props.text}</h2>
                </div>
            </section>
        </>
    )};