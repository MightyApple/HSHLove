import logo from "../assets/logo.svg";
import './loginHead.css';

export default function Root(props) {
    return (
        <>
            <section className={'formLogin'}>
                <div>
                    <img src={logo} alt={'logo'} width={50} height={50}/>
                </div>
                <div className={'normalFontSize'}>
                    <h1 className={'bigHeadline'}>{props.headline}</h1>
                    <h2>{props.text}</h2>
                </div>
            </section>
        </>
    )};