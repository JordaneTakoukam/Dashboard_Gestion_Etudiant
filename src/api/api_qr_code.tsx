import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/qr-code`;

const token = localStorage.getItem(wstjqer);

interface ResponseQrCode{
    success:boolean,
    qrCode:any
}

export async function apiGenerateQrCode({ annee, semestre, section, niveau, cycle }: { annee:number, semestre:number, section:any, cycle:any, niveau:any,}) {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/generate-qr`,
            { annee, semestre, section, niveau, cycle },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating section:', error);
        throw error;
    }
}