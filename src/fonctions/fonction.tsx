import { config } from "../config";
import CryptoJS from 'crypto-js';




export function capitalizeFirstLetter(text: string) {
  if (text.length === 0) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}




export async function decrypt(encryptedValue: String) {
  const iv = encryptedValue.substr(0, 32);
  const ciphertext = encryptedValue.substr(32);

  const ivWordArray = CryptoJS.lib.WordArray.create(iv);
  const ciphertextWordArray = CryptoJS.lib.WordArray.create(ciphertext);

  const secretKey = config.cryptoKey; // Accéder à la clé

  const decrypted = CryptoJS.AES.decrypt({
    ciphertext: ciphertextWordArray,
    iv: ivWordArray,
  }, secretKey).toString(CryptoJS.enc.Utf8);

  return decrypted;
}


export function validateEmail(email: string) {

  if (!email) {
    return "toast.email_requis";
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "L'adresse e-mail n'est pas valide.";
  }
  return '';
}

export function validatePassword(password: string) {
  if (!password) {
    return "toast.mot_de_passe_requis";
  }
  if (!password || password.trim().length < 8) {
    return "toast.mot_de_passe_min_longueur";
  }

  // Vérifie la présence d'au moins une lettre et un chiffre dans le mot de passe
  const containsLetter = /[a-zA-Z]/.test(password);
  const containsNumber = /\d/.test(password);

  if (!containsLetter || !containsNumber) {
    return "toast.mot_de_passe_lettre_chiffre";
  }

  return '';
}

export function formatDateForInput(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function formatYear(year: number) {
  return `${year}/${year + 1}`;
}

export function extractYear(yearRange: string) {
  const parts = yearRange.split('/');
  return parseInt(parts[0]);
}

export function generateYearRange(currentYear: number, startYear: number) {
  const yearRange = [];
  for (let year = currentYear; year >= startYear; year--) {
    const nextYear = year + 1;
    yearRange.push(`${year}/${nextYear}`);
  }
  return yearRange;
}

export function premierElement(value: String) {
  // Diviser la chaîne en fonction des espaces
  if (value) {
    const elements = value.split(" ");
    // Récupérer le premier élément
    const premier = elements[0];
    return premier;
  }
  return undefined;
}

// Vérifie si une période chevauche une autre période dans l'emploi du temps
// const verifierChevauchementPeriode = (periode: PeriodeType): boolean => {
//     for (const autrePeriode of listPeriode) {
//         // Convertir les heures de début et de fin en minutes pour faciliter la comparaison
//         const heureDebutPeriode = convertirHeureVersMinutes(periode.heureDebut);
//         const heureFinPeriode = convertirHeureVersMinutes(periode.heureFin);
//         const heureDebutAutrePeriode = convertirHeureVersMinutes(autrePeriode.heureDebut);
//         const heureFinAutrePeriode = convertirHeureVersMinutes(autrePeriode.heureFin);

//         // Vérifier si les périodes se chevauchent
//         if (
//             (heureDebutPeriode >= heureDebutAutrePeriode && heureDebutPeriode < heureFinAutrePeriode) ||
//             (heureFinPeriode > heureDebutAutrePeriode && heureFinPeriode <= heureFinAutrePeriode) ||
//             (heureDebutPeriode <= heureDebutAutrePeriode && heureFinPeriode >= heureFinAutrePeriode)
//         ) {
//             return true; // Il y a un chevauchement
//         }
//     }
//     return false; // Aucun chevauchement trouvé
// };




export function removeLastLowwecase(e: string) {
  return e;
}
