export const config = {
    roles: { superAdmin: "super-admin", admin: "admin", enseignant: 'enseignant', etudiant: 'etudiant', delegue: 'delegue' },
    nameApp: "SchoolApp",
    copyRight: '2024 - 2025',
    version: "0.0.1",
    cryptoKey: "gestion_etudiant_crypto_2024",
    facebook: "#",
    instagram: "#",
    twitter: "#",
}



export const apiUrl = import.meta.env.VITE_APP_API_URL || "non defini";
export const wstjqer = import.meta.env.VITE_APP_WSTJQER || "non defini";

export const r_sup_ad = import.meta.env.VITE_APP_ROLE_SUPER_ADMIN || "non defini";
export const r_adm = import.meta.env.VITE_APP_ROLE_ADMIN || "non defini";
export const r_enseig = import.meta.env.VITE_APP_ROLE_ENS || "non defini";
export const r_del = import.meta.env.VITE_APP_ROLE_DEL || "non defini";
export const r_etud = import.meta.env.VITE_APP_ROLE_ETU || "non defini";

export const socket_url = import.meta.env.VITE_APP_SOCKET_URL || 'socket url non defini'


export const serveurUrl = import.meta.env.VITE_APP_SERVEUR_URL || 'serveur url non defini'
