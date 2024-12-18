import { config } from "../config";
import CryptoJS from 'crypto-js';
import { jours } from "../pages/CommonPage/EmploiDeTemp";
import { t } from "i18next";
import { apiGetRolePermissions } from "../api/api_permission";
import createToast from "../hooks/toastify";



export function capitalizeFirstLetter(text: string) {
  if (text.length === 0) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const trimString = (str: string) => str.trim();

export const sortEnseignements = (periode: PeriodeEnseignementType, langue: string) => {
  if(periode.enseignements){
      periode.enseignements.sort((a, b) => {
        const libelleA = langue === 'fr' ? a.matiere.libelleFr : a.matiere.libelleEn;
        const libelleB = langue === 'fr' ? b.matiere.libelleFr : b.matiere.libelleEn;
        
        const trimmedAndCapitalizedA = capitalizeFirstLetter(trimString(libelleA));
        const trimmedAndCapitalizedB = capitalizeFirstLetter(trimString(libelleB));

        if (trimmedAndCapitalizedA < trimmedAndCapitalizedB) return -1;
        if (trimmedAndCapitalizedA > trimmedAndCapitalizedB) return 1;
        return 0;
      });
  }
  return periode;
};

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


export function isValidVerificationCode(code: string) {
  if (code.length < 6) {
    return "Le code n'est pas valide";
  }
  return '';
}

export function isValidEmail(email: string) {
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

export function formatDateTimeForInput(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  // Récupère les composants de l'heure
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const formattedTime = `${hours}:${minutes}`
  const formattedDate = `${year}-${month}-${day}`;
  return `${formattedDate}T${formattedTime}`;
}

export function formatYear(year: number | undefined) {
  if(year){
    return `${year}-${year + 1}`;
  }
  return undefined;
}


export function extractYear(yearRange: string) {
  const parts = yearRange.split('-');
  return parseInt(parts[0]);
}

export function generateYearRange(currentYear: number, startYear: number) {
  const yearRange : string[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    const nextYear = year + 1;
    yearRange.push(`${year}-${nextYear}`);
  }
  return yearRange;
}

export function generateYearRange2(currentYear: number, startYear: number) {
  const yearRange :string[]= [];
  
  // Ajouter les 5 années suivant l'année courante
  let i=5;
  while(i>0) {
    const year = currentYear + i;
    const nextYear = year + 1;
    yearRange.push(`${year}-${nextYear}`);
    i--;
  }

  // Ajouter les années comprises entre l'année courante et startYear
  for (let year = currentYear; year >= startYear; year--) {
    const nextYear = year + 1;
    yearRange.push(`${year}-${nextYear}`);
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
                      // const typeEns = enseignement.matiere.typesEnseignement && enseignement.matiere.typesEnseignement.find((ens) => ens.typeEnseignement === periodesAvecJour[0].typeEnseignement);
                      // if (typeEns) {
                      //     countAbsences++;
                      // }
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

export function formatDateWithLang(date:string, lang:string):string{
  const dateStr = date;
  const dateObj = new Date(dateStr);

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // +1 car les mois sont indexés à partir de 0
  const day = dateObj.getDate().toString().padStart(2, '0');

  let formattedDate = `${year}-${month}-${day}`;
  if(lang==='fr'){
    formattedDate = `${day}-${month}-${year}`;
  }
  return formattedDate;
}

export function formatDatetime(datetime: string, lang: string): string {
  // Crée un objet Date à partir de la chaîne datetime
  const dateObj = new Date(datetime);

  // Vérifie si la date est valide
  if (isNaN(dateObj.getTime())) {
      throw new Error("Date invalide");
  }

  // Récupère les composants de la date
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // +1 car les mois sont indexés à partir de 0
  const day = dateObj.getDate().toString().padStart(2, '0');

  // Récupère les composants de l'heure
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  // Formate la date en fonction de la langue
  let formattedDate = `${year}-${month}-${day}`; // Format par défaut (en-US)
  if (lang === 'fr') {
      formattedDate = `${day}-${month}-${year}`; // Format français
  }

  // Formate l'heure en fonction de la langue
  let formattedTime = `${hours}:${minutes}`;
  if (lang === 'en') {
      const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
      const hours12 = ( parseInt(hours) % 12 || 12).toString().padStart(2, '0');
      formattedTime = `${hours12}:${minutes} ${period}`; // Format anglais avec AM/PM
  }

  return `${formattedDate} à ${formattedTime}`;
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

export function nbTotalAbsencesNonJustifier(listeAbsences: AbsenceType[]|undefined): string {
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
      if(absence.etat==0){
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
      }
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

export function nbTotalAbsencesJustifier(listeAbsences: AbsenceType[]|undefined): string {
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
      if(absence.etat==1){
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
      }
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

export function calculAbsence(absence: AbsenceType): string {
  // Vérifier si la liste d'absences est vide
    
    
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
      
// Retourner la somme totale d'heures sous forme de chaîne
  let formatHour;
  if (Number.isInteger(differenceHeures)) {
      formatHour = differenceHeures.toString();
  } else {
      formatHour = differenceHeures.toFixed(2);
  }
  return formatHour.toString();

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

export function createPDF(blob:Blob, title:string, type?:string){
    const url = URL.createObjectURL(blob);
    // Télécharger le PDF
    const link = document.createElement('a');
    link.href = url;
    
    let linkDowload=title+'.pdf';
    if(type){
      linkDowload=title+'.'+type;
    }
    link.download = linkDowload;
    document.body.appendChild(link);
    link.click();
    // Libérer l'URL de l'objet
    URL.revokeObjectURL(url);
}

export function compareDates(date1: string, date2: string): boolean {
  // Supprimez les parties de temps pour assurer une comparaison précise des dates
  const trimmedDate1 = date1.split('T')[0];
  const trimmedDate2 = date2.split('T')[0];

  // Comparez les deux dates
  return trimmedDate1 === trimmedDate2;
}

export function calculGrossBonus(totalHoraire : number, tauxHoraire : number) {
  return (totalHoraire * tauxHoraire);
}

export function calculIRNC(montantBrut : number) {
  return ((montantBrut * 11)/100);
}

export function calculNetBonus(montantBrut : number, irnc: number) {
  return (montantBrut - irnc);
}

 // Fonction pour récupérer les permissions par défaut à partir des fichiers JSON
 export async function loadDefaultPermissions(role : string, lang:string) {
  let defaultPermissions:{_id:string, permission:string}[] = [];
  
  // Charger le fichier approprié en fonction du rôle de l'utilisateur
  try {
    
    await apiGetRolePermissions({ role: role }).then((e: ReponseApiPros) => {
      if(e.success){
        defaultPermissions = e.data;
      }else{
        createToast(e.message[lang as keyof typeof e.message], '', 2);
      }
    }).catch((e) => {
        console.error("Erreur lors du chargement des permissions par défaut :", e);
        createToast(t('message.erreur'), "", 2);
    })
  } catch (e) {
      console.error("Erreur lors du chargement des permissions par défaut :", e);
      createToast(t('message.erreur'), "", 2);
  }
  return defaultPermissions;
};

// Fonction pour comparer les permissions et créer la liste finale
export async function createFinalPermissionList(
    userPermissions: { is_granted: boolean; permission: { nom: string } }[],
    role: string,
    lang: string
  ): Promise<string[]> {
  // Charger les permissions par défaut en fonction du rôle
  const defaultPermissions: { _id: string; permission: string }[] = await loadDefaultPermissions(role, lang);

  // Créer une liste finale des permissions
  const finalPermissions: string[] = [];

  // Ajouter les permissions personnalisées de l'utilisateur avec is_granted: true
  userPermissions.forEach((userPermission) => {
    if (userPermission.is_granted) {
      finalPermissions.push(userPermission.permission.nom);
    }
  });

  // Ajouter les permissions par défaut qui ne sont pas dans les permissions personnalisées avec is_granted: false
  defaultPermissions.forEach((defaultPermission) => {
    const permissionExists = userPermissions.some(
      (userPermission) =>
        userPermission.permission.nom === defaultPermission.permission && !userPermission.is_granted
    );

    // Ajouter la permission par défaut si elle n'est pas présente dans les permissions personnalisées avec is_granted: false
    if (!permissionExists) {
      finalPermissions.push(defaultPermission.permission);
    }
  });

  return finalPermissions;
}

export function getNavLinkClass (isActive: boolean){ 
  return  `group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-secondary ${isActive ? 'text-secondary' : ''}`;
}





