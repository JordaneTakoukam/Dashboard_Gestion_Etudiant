import { config } from "../config";
import CryptoJS from 'crypto-js';


export function formatRoleName(value: string) {
  const roles = config.roles;
  return value === roles.admin ? 'Administrateur' :
    value === roles.teacher ? 'Enseignant' :
      value === roles.delegate ? 'Délégué' :
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

  // Accéder à la clé secrète à partir de la variable d'environnement
  const secretKey = process.env.CRYPO_KEY;

  const decrypted = CryptoJS.AES.decrypt({
    ciphertext: ciphertextWordArray,
    iv: ivWordArray,
  }, secretKey).toString(CryptoJS.enc.Utf8);

  return decrypted;
}

