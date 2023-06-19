import { useState } from "react";

/** Liest den Wert des Cookies raus, wenn kein Cookie vorhanden, kommt ein leerer String zurück*/
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/** Überprüft die Sitzung */
function sessionCheck() {
  var cookieValue = getCookie("loggedIn");
  return cookieValue;
}

export default function useLogin() {
  const [loggedIn, setLoggedIn] = useState(sessionCheck());

  function updateLoggedIn() {
    setLoggedIn(sessionCheck());
  }

  return {
    loggedIn,
    updateLoggedIn,
    setLoggedIn,
  };
}
