import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/devoir/reponse`;

const token = localStorage.getItem(wstjqer);

export async function soumettreTentative ({devoirId, etudiantId, reponses}:{devoirId:string, etudiantId:string, reponses:{question:string, reponses:string[]}[]}) {
  try {
    const response:AxiosResponse<any> = await axios.post(
        `${api}/soumettreTentative/${devoirId}`, 
        {etudiantId, reponses},
        {
            headers: {
                'Content-Type': 'application/json',
                'token': token,
            },
        },
    );
    return response.data
  } catch (error) {
    console.error('Error creating section:', error);
    throw error;
  }
};
