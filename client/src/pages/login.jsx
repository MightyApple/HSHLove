import './login.css'
import logo from '../assets/logo.svg'

import FormText from '../components/form/formText'
import FormButton from '../components/form/formButton'
import LoginHead from '../components/loginHead'
import {Link} from "react-router-dom";
export default function Root() {
    return (
        <>
            <div className={'secondaryContainer'}>
                <LoginHead headline={'Login'} text={'Melde dich mit deinen Daten deiner Registration an.'}></LoginHead>
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
                        <p>Noch kein Account? <Link to={'/registrieren'} className={'normalFontSize'}>Registrier dich</Link></p>
                    </div>
                </section>
            </div>
        </>
    )};