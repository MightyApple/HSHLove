import './tag.css'
import React, { useState } from 'react';

function CheckboxButton(props) {
    const [isChecked, setIsChecked] = useState(false);

    const handleButtonClick = () => {
        setIsChecked(!isChecked);
    };

    return (
        <>
            <button
                className={props.class+` tag ${isChecked ? 'checked' : ''}`}
                onClick={handleButtonClick}
                disabled={props.disabled}
            >
                {props.name}
            </button>
        </>
    );
}

export default CheckboxButton;