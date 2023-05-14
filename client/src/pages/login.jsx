import './login.css'
import logo from '../assets/logo.svg'

import FormText from '../components/formText'
import FormButton from '../components/formButton'
import {Link} from "react-router-dom";
export default function Root() {
    return (
        <>
            <div className={'secondaryContainer'}>
                <section className={'formLogin'}>
                    <div>
                        <img src={logo} alt={'logo'} width={50} height={50}/>
                    </div>
                    <div className={'normalFontSize'}>
                        <h1 className={'bigHeadline'}>Login</h1>
                        <h2>Melde dich mit deinen Daten deiner Registration an.</h2>
                    </div>
                </section>
                <section>
                    <form>
                        <FormText lable={'Email'} name={'email'} placeholder={'name@example.com'} password={false}></FormText>
                        <FormText lable={'Passwort'} name={'password'} placeholder={'min. 8 Zeichen'} password={true}></FormText>
                        <div className={'normalFontSize checkboxForm'}>
                            <label>eingelogt bleiben</label>
                            <input type={"checkbox"} name={'stayLogged'} />
                        </div>
                        <FormButton name={'Login'} buttonID={'submit'}></FormButton>
                    </form>
                    <div className={'formEnd'}>
                        <button className={'normalFontSize'}>Passwort vergessen</button>
                        <p>Noch kein Account? <Link to={'registrieren'} className={'normalFontSize'}>Registrier dich</Link></p>
                    </div>
                </section>
            </div>
        </>
    )};