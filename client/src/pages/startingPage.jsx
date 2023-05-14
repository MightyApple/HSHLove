import FormButton from "../components/form/formButton";
import logo from "../assets/logo.svg";
import './startingPage.css'

export default function Root() {
    return (
        <>
            <section className={'startPage secondaryContainer'}>
                <div className={'startinLogo bigHeadline'}>
                    <img src={logo} alt={'logo'} width={168} height={168}/>
                    <p>Hsh<span>Love</span></p>
                </div>
                <div className={'startRoute'}>
                    <FormButton name={'Login'} route={'/login'}></FormButton>
                    <FormButton name={'Registrieren'} route={'/registrieren'}></FormButton>
                </div>
            </section>
        </>
    )};