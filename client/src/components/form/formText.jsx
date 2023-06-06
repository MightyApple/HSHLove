import eye from '../../assets/eye-svgrepo-com.svg'
import {useState} from "react";

import './formText.css'

export default function Root(props) {
    let showEyeIcon = props.password;

    const [showPassword, setShowPassword] = useState(showEyeIcon);
    let inputType = props.password && showPassword ? 'password' : 'text';

    if (!props.password) {
        inputType = 'text';
    }
    if (props.date) {
        inputType = 'date';
    }

    function togglePassword() {
        setShowPassword(!showPassword);
    }

    return (
        <div className={'normalFontSize formText'}>
            <label>{props.lable}</label>
            <input id={props.textID} type={inputType} placeholder={props.placeholder} name={props.name} value={props.value} onKeyDown={props.onKeyDown} required />

            {/*
                Wenn props.password true ist, wird dieses span angezeigt
                */}
            {showEyeIcon && (
                <span onClick={togglePassword} style={{ pointerEvents: 'auto' }}>
                    <img src={eye} alt={'password eye'} width={19} height={11}/>
                </span>
            )}
        </div>
    );
}