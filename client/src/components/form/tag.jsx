import './tag.css'
import React, { useState } from 'react';

/**
 Anleitung der Kompnente

 Die Komponente erstellt ein Tag, welches mit dem "name" tag seinen Wert bekommt.
 Mit "class" kann mman den Tags Klassen geben und mit "disabled" kann man bestimmen, ob man die Farbe des Tags per Button click wechseln kann.
 */
function CheckboxButton(props) {
    const [isChecked, setIsChecked] = useState(false);

    const handleButtonClick = () => {
        if (props.class.includes('click')) {
            if(Array.from(document.getElementById(props.id).classList).includes("checked")){
                setIsChecked(false)
                document.getElementById(props.id).classList.remove("checked")
            }else{
                setIsChecked(true);
            }
            
        }
    };

    return (
        <>
            <button
                className={props.class+` tag ${isChecked ? 'checked' : ''}`}
                onClick={handleButtonClick}
                disabled={props.disabled}
                id={props.id}
            >
                {props.name}
            </button>
        </>
    );
}

export default CheckboxButton;