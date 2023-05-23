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
                className={`tag ${isChecked ? 'checked' : ''}`}
                onClick={handleButtonClick}
            >
                {props.name}
            </button>
        </>
    );
}

export default CheckboxButton;