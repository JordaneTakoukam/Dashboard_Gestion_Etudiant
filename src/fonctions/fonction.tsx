import { config } from "../config";
import CryptoJS from 'crypto-js';
import { jours } from "../pages/CommonPage/EmploiDeTemp";




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

export function calculateSeancesEffectuees (enseignement: MatiereEnseignement, periodes:PeriodeType[]|null){
        
  if (!enseignement.matiere || !enseignement.matiere.typesEnseignement) {
      return 0;
  }


  const absences = enseignement.matiere.typesEnseignement.reduce((acc: AbsenceType[], type: any) => {
      acc.push(...type.enseignantPrincipal.absences);
      return acc;
  }, []);

  let seancesEffectuees = enseignement.nombreSeance;
  let countAbsences = 0;

  if (absences.length > 0) {
      const absencesMap = new Map<string, boolean>(); // Map pour stocker les absences déjà traitées
      const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      absences.forEach((absence) => {
          // Convertir la date d'absence en objet Date
          const dateAbsence = new Date(absence.dateAbsence);

          // Obtenez le jour de la semaine en utilisant les méthodes de l'objet Date
          const jourSemaine = joursSemaine[dateAbsence.getDay()];
          const ordre = jours.find((jour) => jour.libelleFr.toLowerCase() === jourSemaine.toLowerCase())?.ordre ?? -1;

          if (ordre !== -1 && periodes) {
              
              const key = `${ordre}-${absence.heureDebut}-${absence.heureFin}`; // Clé pour identifier l'absence
              if (!absencesMap.has(key)) {
                  const periodesAvecJour = periodes.filter((periode) => 
                      periode.jour == ordre && 
                      periode.heureDebut === absence.heureDebut && 
                      periode.heureFin === absence.heureFin
                  );

                  if (periodesAvecJour.length > 0) {
                      const typeEns = enseignement.matiere.typesEnseignement && enseignement.matiere.typesEnseignement.find((ens) => ens.typeEnseignement === periodesAvecJour[0].typeEnseignement);
                      if (typeEns) {
                          countAbsences++;
                      }
                  }
                  absencesMap.set(key, true); // Marquer l'absence comme traitée
              }
          }
      });
  }

  // Calculer le nombre de séances effectuées
  seancesEffectuees -= countAbsences;
  return seancesEffectuees;
};

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




// calculer le nombre total d'heure d'absence a partir de la liste d'abscene
export function formatDate(date:string):string{
  const dateStr = date;
  const dateObj = new Date(dateStr);

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // +1 car les mois sont indexés à partir de 0
  const day = dateObj.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function nbTotalAbsences(listeAbsences: AbsenceType[]|undefined): string {
  // Vérifier si la liste d'absences est vide
  if(listeAbsences){
    
    if (listeAbsences.length === 0) {
      return '0';
    }

    // Initialiser la somme totale d'heures à 0
    let totalHours = 0;

    // Parcourir chaque absence dans la liste
    listeAbsences.forEach(absence => {
      // Extraire les heures de début et de fin de l'absence
      const heureDebut = parseInt(absence.heureDebut.split(':')[0]);
      const minuteDebut = parseInt(absence.heureDebut.split(':')[1]);
      const heureFin = parseInt(absence.heureFin.split(':')[0]);
      const minuteFin = parseInt(absence.heureFin.split(':')[1]);

      // Calculer les heures et minutes de début et de fin en décimales
      const heureDebutDecimal = heureDebut + minuteDebut / 60;
      const heureFinDecimal = heureFin + minuteFin / 60;

      // Calculer la différence d'heures entre l'heure de début et l'heure de fin
      let differenceHeures = heureFinDecimal - heureDebutDecimal;

      // Calculer la différence de minutes entre l'heure de début et l'heure de fin
      // const differenceMinutes = minuteFin - minuteDebut;

      // Si la différence de minutes est positive, ajouter une heure supplémentaire
      // if (differenceMinutes > 0) {
      //   totalHours += 1;
      // }
      // Si la différence de minutes est négative, ajuster les heures
      if (minuteFin < minuteDebut) {
          differenceHeures -= 1 / 60; // Retirer une heure
      }
      // Ajouter la différence d'heures à la somme totale d'heures
      totalHours += differenceHeures;
    });

    // Retourner la somme totale d'heures sous forme de chaîne
    let formatHour;
    if (Number.isInteger(totalHours)) {
        formatHour = totalHours.toString();
    } else {
        formatHour = totalHours.toFixed(2);
    }
    return formatHour.toString();
  }
  return '0';
}

export function reduceWord(word: string, maxSize: number): string {
  // Vérifier si l'utilisateur est sur mobile ou non
  const isMobile = window.innerWidth <= 768; // Taille standard de la vue mobile

  if (!isMobile) {
      return word;
  } else {
      // Sur PC, réduit le mot si nécessaire
      if (word.length > maxSize) {
          return word.slice(0, maxSize) + "...";
      } else {
          return word;
      }
  }
}