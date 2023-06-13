import { useNavigate } from "react-router-dom";
import FormButton from "../components/form/formButton"
import Trenner from "../components/trenner"
import './footer.css'

export default function Root(props) {
    let navigate = useNavigate();
    function logOutForm(){
        fetch("/logOut",{
            method: 'GET',
        }).then((data)=>{
            document.cookie = "loggedIn" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            navigate("/")
        })    
    }

    const colorThemes = [
        {
            primaryColor: 'rgba(249, 158, 0, 1)',
            secondaryColor: 'rgba(24, 66, 140, 1)',
            bgPrimaryColor: 'rgba(249, 158, 0, 0.4)',
            bgSecondaryColor: 'rgba(24, 66, 140, 0.58)',
            primaryColorHover: 'rgb(196,131,21)'
        },
        {
            primaryColor: 'rgba(193, 213, 0, 1)',
            secondaryColor: 'rgba(107, 33, 132, 1)',
            bgPrimaryColor: 'rgba(193, 213, 0, 0.4)',
            bgSecondaryColor: 'rgba(107, 33, 132, 0.58)',
            primaryColorHover: 'rgb(168,185,14)'
        },
        {
            primaryColor: 'rgba(233, 23, 18, 1)',
            secondaryColor: 'rgba(0, 113, 189, 1)',
            bgPrimaryColor: 'rgba(233, 23, 18, 0.4)',
            bgSecondaryColor: 'rgba(0, 113, 189, 0.58)',
            primaryColorHover: 'rgb(197,29,27)'
        },
        {
            primaryColor: 'rgba(61, 176, 56, 1)',
            secondaryColor: 'rgba(0, 163, 237, 1)',
            bgPrimaryColor: 'rgba(61, 176, 56, 0.4)',
            bgSecondaryColor: 'rgba(0, 163, 237, 0.58)',
            primaryColorHover: 'rgb(49,131,46)'
        },
        {
            primaryColor: 'rgba(235, 21, 19, 1)',
            secondaryColor: 'rgba(191, 207, 0, 1)',
            bgPrimaryColor: 'rgba(235, 21, 19, 0.4)',
            bgSecondaryColor: 'rgba(191, 207, 0, 0.58)',
            primaryColorHover: 'rgb(175,29,27)'
        },
        {
            primaryColor: 'rgba(255, 203, 2, 1)',
            secondaryColor: 'rgba(238, 23, 30, 1)',
            bgPrimaryColor: 'rgba(255, 203, 2, 0.58)',
            bgSecondaryColor: 'rgba(238, 23, 30, 0.4)',
            primaryColorHover: 'rgb(232, 185, 0, 1)'
        }
    ];

    let currentThemeIndex = 0;

    function changeColorTheme() {
        const root = document.documentElement;

        // Aktuelle Farbkombination abrufen
        const currentTheme = colorThemes[currentThemeIndex];

        // CSS-Variablenwerte aktualisieren
        root.style.setProperty('--primaryColor', currentTheme.primaryColor);
        root.style.setProperty('--secondaryColor', currentTheme.secondaryColor);
        root.style.setProperty('--bgPrimaryColor', currentTheme.bgPrimaryColor);
        root.style.setProperty('--bgSecondaryColor', currentTheme.bgSecondaryColor);
        root.style.setProperty('--primaryColorHover', currentTheme.primaryColorHover);

        // Index erhöhen und überprüfen, ob er den maximalen Wert überschritten hat
        currentThemeIndex++;
        if (currentThemeIndex >= colorThemes.length) {
            currentThemeIndex = 0;
        }
    }
    
    return (
        <>
            <footer>
                <Trenner></Trenner>
                <div className={'primaryContainer'}>
                    <FormButton name={'Impressum'} id={'logout'} route={'/impressum'}></FormButton>
                    <FormButton name={'Nutzerbedingungen'} id={'logout'} route={'/nutzerbedingungen'}></FormButton>
                    <FormButton name={'Datenschutz'} id={'logout'} route={'/datenschutz'}></FormButton>
                </div>
                <div className={'primaryContainer'}>
                    {props.abmelden && (
                        <FormButton name={'Abmelden'} id={'logout'} onClick={logOutForm}></FormButton>
                    )}
                    <FormButton name={'Farbschema'} id={'logout'} onClick={changeColorTheme}></FormButton>
                </div>
            </footer>
        </>)}