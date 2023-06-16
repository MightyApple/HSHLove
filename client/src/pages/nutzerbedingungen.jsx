import React from 'react';
import Footer from "../components/footer";
import {redirect} from "react-router-dom";
import Navbar from "../components/navbar";

const Nutzerbedingungen = () => {

  return (
		<div className='div1'>
			<Navbar></Navbar>
			<div className={'primaryContainer'}>
				<h1>Allgemeines</h1>

				<h2>1.1 Geltungsbereich</h2>
				<p>
					Diese Nutzungsbedingungen regeln die Nutzung der Webseite für Studenten der lokalen Hochschule.<br></br> Mit der Registrierung und Nutzung der Webseite akzeptierst du diese Nutzungsbedingungen.
				</p>

				<h2>1.2 Altersbeschränkung</h2>
				<p>
					Die Nutzung der Webseite ist nur für Personen ab 18 Jahren gestattet.<br></br> Mit der Registrierung bestätigst du, dass du das erforderliche Mindestalter erfüllst.
				</p>

				<h2>1.3 Änderungen der Nutzungsbedingungen</h2>
				<p>
					Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern.<br></br> Änderungen werden auf der Webseite veröffentlicht und treten mit ihrer Veröffentlichung in Kraft.<br></br> Es liegt in deiner Verantwortung, regelmäßig die Nutzungsbedingungen einzusehen.
				</p>

				<h2>2. Nutzungsrechte</h2>

				<h3>2.1 Registrierung und Profilerstellung</h3>
				<p>
					Du stimmst zu, korrekte und aktuelle Informationen bei der Registrierung anzugeben. <br></br> Du bist allein verantwortlich für die Inhalte deines Profils.
				</p>

				<h3>2.2 Inhalte auf der Webseite</h3>
				<p>
					Du erkennst an, dass Inhalte auf der Webseite veraltet, nicht wahrheitsgemäß oder erfunden sein können. <br></br>Wir übernehmen keine Verantwortung für die Genauigkeit oder Richtigkeit dieser Inhalte.
				</p>

				<h3>2.3 Urheberrecht und geistiges Eigentum</h3>
				<p>
					Alle Elemente und Inhalte auf der Webseite sind urheberrechtlich geschützt.<br></br> Du darfst diese Elemente und Inhalte ohne unsere ausdrückliche schriftliche Genehmigung nicht verwenden, vervielfältigen oder verbreiten.
				</p>

				<h2>3. Haftungsausschluss und Gewährleistung</h2>

				<h3>3.1 Haftungsausschluss</h3>
				<p>
					Wir haften nicht für Schäden, die durch die Nutzung der Webseite entstehen.<br></br> Die Nutzung der Webseite erfolgt auf eigene Gefahr.
				</p>

				<h3>3.2 Viren und andere Gefahren</h3>
				<p>
					Wir übernehmen keine Verantwortung für Viren oder andere schädliche Elemente, die durch die Nutzung der Webseite übertragen werden könnten. <br></br>Es liegt in deiner Verantwortung, geeignete Sicherheitsmaßnahmen zu ergreifen.
				</p>

				<h2>4. Beendigung</h2>
				<p>
					Du kannst deine Registrierung und die Nutzung der Webseite jederzeit beenden. <br></br>Wir behalten uns das Recht vor, deine Registrierung zu löschen und den Zugang zur Webseite jederzeit und ohne Angabe von Gründen zu sperren.
				</p>
			</div>

			<Footer></Footer>
		</div>
	  );
	};

export default Nutzerbedingungen;
