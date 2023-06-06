import Navbar from '../components/navbar';
import React, { useState } from 'react';
import FormText from "../components/form/formText";
import DropDown from '../components/form/dropDown';

import FormButton from "../components/form/formButton";
import AdminHead from '../components/adminHead';



export default function Root(props) {
    const studiengaenge = ["AIS", "CVD", "BWL", "MBP"];
    const geschlecht = ["männlich", "weiblich", "divers", "BWL"];

    const [showList, setShowList] = useState(false); // State für die Anzeige der Liste

    const handleSearch = () => {
        setShowList(true); // Bei Klick auf "Suchen" die Liste anzeigen
    };

    const handleClick = (item) => {
        // Funktion, die beim Klicken auf ein Element in der Liste ausgeführt wird
        console.log("Klick auf Element:", item);
        // Weitere Aktionen ausführen, z. B. Navigation zu einem bestimmten Chat-Kontakt
    };


    if (!props.first) {
        return (
            <>
                <section className={'primaryContainer'}>
                    <AdminHead heading="Nutzer Suchen">  </AdminHead>
                    
                    <FormText textID={'Vorname'} lable={'Name:'} name={'vorname'} placeholder={'Vorname'} password={false}></FormText>
                </section>
                <section className={'primaryContainer tagSection'}>
                    <DropDown
                        label={'Ich studiere:'}
                        selectName={'studium'}
                        selectId={'studiumId'}
                        data={studiengaenge}
                    ></DropDown>
                    
                    <DropDown
                        label={'Ich bin:'}
                        selectName={'geschlecht'}
                        selectId={'geschlechtId'}
                        data={geschlecht}
                    ></DropDown>
                </section>

                <section className={'primaryContainer'}>
                    <div className={'primaryContainer'}>
                        <div className={'primaryContainer'}>
                            <FormButton name={'Suchen'} onClick={handleSearch}></FormButton>
                        </div>
                    </div>
                </section>

                {showList && (
                    <section className={'primaryContainer'}>
                        <ul>
                            <li onClick={() => handleClick("Beispiel 1")}>Beispiel 1</li>
                            <li onClick={() => handleClick("Beispiel 2")}>Beispiel 2</li>
                            <li onClick={() => handleClick("Beispiel 3")}>Beispiel 3</li>
                        </ul>
                    </section>
                )}
            </>
        );
    } else {
        return (
            <>
                <Navbar></Navbar>
            </>
        );
    }
}

