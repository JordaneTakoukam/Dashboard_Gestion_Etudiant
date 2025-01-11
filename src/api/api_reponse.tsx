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

export async function obtenirMeilleurTentativeEtudiant({ devoirId, etudiantId}: {devoirId: string, etudiantId:string}){
  try {
      const response: AxiosResponse<any> = await axios.get(
          `${api}/obtenirMeilleurTentativeEtudiant/${devoirId}/${etudiantId}`,
          {
              headers: {
                  'Content-Type': 'application/json',
                  'token': token,
              },
          },
      );      
      
      return response.data;;
  } catch (error) {
      console.error('Error getting all settings:', error);
      throw error;
  }
}

export async function obtenirNombreTentativesEffectuee({ devoirId, etudiantId}: {devoirId: string, etudiantId:string}){
  try {
      const response: AxiosResponse<any> = await axios.get(
          `${api}/obtenirNombreTentativesEffectuee/${devoirId}/${etudiantId}`,
          {
              headers: {
                  'Content-Type': 'application/json',
                  'token': token,
              },
          },
      );      
      
      return response.data;;
  } catch (error) {
      console.error('Error getting all settings:', error);
      throw error;
  }
}
