import React from 'react';
//import './kontakt.css';

const Kontakt = () => {
  return (
    <div className='div1'>
      <h1 className='titel'>Willkommen im Impressum</h1>
      <p className="kontakt-text">
        Wir wünschen Ihnen viel Erfolg bei Ihrer Suche und hoffen, dass Sie mit unserer Webseite zufrieden sind.<br></br> Bei Wünschen, Fragen oder Verbesserungsvorschlägen melden Sie sich bitte über das Kontaktformular.
        <br /><br />
        <span className="team-name">HSHLove</span>
        <br />
        Ihr Team:
        <br />
        Aylin
        <br />
        Chris
        <br />
        Keith
        <br />
        Yasar
        <br /><br />
        E-Mail: team@stud.hshl.de
        <br /><br />
        Hochschule Hamm-Lippstadt
      </p>
    </div>
  );
};

export default Kontakt;
