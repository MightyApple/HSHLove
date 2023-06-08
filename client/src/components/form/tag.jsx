import './tag.css'
import React, { useState } from 'react';

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