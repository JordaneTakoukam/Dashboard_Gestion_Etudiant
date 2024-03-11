import { config } from "../../config";

export async function logoutFunction() {
    localStorage.removeItem(config.jwt_key);
    window.location.href = '/signin';

}