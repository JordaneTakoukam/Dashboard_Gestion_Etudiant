import axios, { AxiosError } from 'axios';
import { storeTokenInLocalStorage } from '../../middlewares/auth_middleware.js';
import createToast from '../../hooks/toastify.js';
import { config } from './../../config.js'
const api = `${config.apiUrl}/api/v1`;

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
}

interface SignInApiResponse {
    token?: string;
}

interface SignInApiProps {
    email: string;
    mot_de_passe: string;
}

export async function signInApi({ email, mot_de_passe }: SignInApiProps): Promise<ApiResponse<string>> {
    try {

        const response = await axios.post<SignInApiResponse>(
            `${api}/auth/signin`,
            { email, mot_de_passe },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        const data = response.data;

        if (data.token) {
            storeTokenInLocalStorage(data.token);
            createToast("Bienvenue", "", 0)
        } else {
            createToast("Une erreur est survenue, réessayer", "", 2)
        }

        return { success: true, message: 'Connexion réuissi' };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const axiosError: AxiosError<ApiResponse<string>> = error;

            // Vérifiez que axiosError.response n'est pas undefined avant d'y accéder
            if (axiosError.response && axiosError.response.status >= 400 && axiosError.response.status < 500) {
                return { success: false, message: axiosError.response.data?.message || 'Erreur inconnue' };
            }
        }

        // Autre erreur
        throw error;
    }
}
