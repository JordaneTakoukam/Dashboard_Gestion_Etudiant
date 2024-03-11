import { config } from "../config";
import CryptoJS from 'crypto-js';



export function formatRoleName(value: string) {
  const roles = config.roles;
  return value === roles.superAdmin ? 'Super Administrateur' : value === roles.admin ? 'Administrateur' :
    value === roles.enseignant ? 'Enseignant' :
      value === roles.delegue ? 'Délégué' :
        'Étudiant'
}

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


export function isValidEmail(email: string) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "L'adresse e-mail n'est pas valide.";
  }
  return '';
}

export function isValidPassword(password: string) {
  if (!password || password.trim().length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }

  // Vérifie la présence d'au moins une lettre et un chiffre dans le mot de passe
  const containsLetter = /[a-zA-Z]/.test(password);
  const containsNumber = /\d/.test(password);

  if (!containsLetter || !containsNumber) {
    return "Le mot de passe doit contenir au moins une lettre et un chiffre.";
  }

  return '';
}