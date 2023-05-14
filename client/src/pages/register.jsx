import LoginHead from "../components/loginHead";
import FormText from "../components/form/formText";
import FormButton from "../components/form/formButton";
import {Link} from "react-router-dom";

export default function Root() {
    return (
        <>
            <div className={'secondaryContainer'}>
                <LoginHead headline={'Registrieren'} text={'Erstelle ein neuen Account, um dich damit immer anmelden zu können.'}></LoginHead>
                <section>
                    <form>
                        <FormText lable={'Email'} name={'email'} placeholder={'name@example.com'} password={false}></FormText>
                        <FormText lable={'Passwort'} name={'password'} placeholder={'min. 8 Zeichen'} password={true}></FormText>
                        <FormText lable={'Passwort wiederholen'} name={'password2'} placeholder={'min. 8 Zeichen'} password={true}></FormText>
                        <div className={'normalFontSize checkboxForm'}>
                            <label>eingelogt bleiben</label>
                            <input type={"checkbox"} name={'stayLogged'} />
                        </div>
                        <FormButton name={'Registrieren'} buttonID={'submit'}></FormButton>
                    </form>
                    <div className={'formEnd'}>
                        <p>Du hast bereits ein Account? <Link to={'/login'} className={'normalFontSize'}>Dann melde dich an</Link></p>
                    </div>
                </section>
            </div>
        </>
    )};