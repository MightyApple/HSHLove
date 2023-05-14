import {Link} from "react-router-dom";
import './formButton.css'

/**
        Anleitung der Kompnente

    Die Komponente Stellt einen Button dar und der Inhalt des "name" props ist der Text in dem Button.
    Es gibt zwei wege diese Komponente zu benutzen.
 1. Als Route zu einer neuen Seite.
    Hierfür muss man sowohl die "name" als auch die "route" props übergeben
    Wenn man bei "route" am anfang ein "/" schreibt wird immer die Route von der Startseite gelesen
    Lässt man das "/" weg, wird die Route von der aktuellen Route gelesen.
    Bsp.: <FormButton name={'Login'} route={'/login'}></FormButton>

 2. Als submit Button.
    Hierfür muss man nur das "name" prop angeben
    Bsp.: <FormButton name={'Login'}></FormButton>
 */


export default function Root(props) {
    if (props.route) {
        return (
            <>
                <div>
                    <Link className={'formButton'} to={props.route} id={props.buttonID}>{props.name}</Link>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div>
                    <button className={'formButton'} id={props.buttonID}>{props.name}</button>
                </div>
            </>
        )
    }
};