import React from 'react';
import LoginHead from '../components/loginHead'
import Nutzerbedingung from '../pages/nutzerbedingungen';
import Kontkt from '../components/kontakt';
import Datenschutz from '../pages/datenschutz';

const App = () => {
  return (
    <div>
      <LoginHead></LoginHead>

      <Kontkt></Kontkt>



      <Nutzerbedingung></Nutzerbedingung>

      <Datenschutz></Datenschutz>



    </div>
  );
};

export default App;

