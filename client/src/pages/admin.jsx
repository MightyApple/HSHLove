import FormButton from "../components/form/formButton";
import logo from "../assets/logo.svg";

import './admin.css';


export default function Root() {
    return (
        
        <>
            <section className={'startPage secondaryContainer'}>
                <div className={'startinLogo bigHeadline'}>
                    <img src={logo} alt={'logo'} width={168} height={168}/>
                    <p>Hallo<span>    name</span></p>
                </div>
                <div className={'startRoute'}>
                    <FormButton name={'Nutzersuchen'} route={'/nutzer'}></FormButton>
                    <FormButton name={'Gemeldete Nutzer'} route={'/gemeldet'}></FormButton>
                </div>
            </section>
        </>
    )};