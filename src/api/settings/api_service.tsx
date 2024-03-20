// import axios, { AxiosResponse } from 'axios';
// import { config } from '../../config.js'

// interface ServiceData {
//     success: boolean;
//     message: {
//         [key: string]: string;
//     };
//     data: any;
// }

// const api = `${config.apiUrl}/api/v1/setting/service`;

// const token = localStorage.getItem(config.jwt_key);

// export async function apiCreateService({ code, libelle }: { code: string; libelle: string }): Promise<ServiceData> {
//     try {
//         const response: AxiosResponse<ServiceData> = await axios.post(
//             `${api}/create`,
//             { code, libelle },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'token': token,
//                 },

//             },
//         );

//         return response.data;
//     } catch (error) {
//         console.error('Error creating service:', error);
//         throw error;
//     }
// }

// export async function apiUpdateService({ code, libelle, serviceId }: { code: string; libelle: string; serviceId: string }): Promise<ServiceData> {
//     try {
//         const response: AxiosResponse<ServiceData> = await axios.put(
//             `${api}/update/${serviceId}`,
//             { code, libelle },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'token': token,
//                 },
//             },
//         );

//         return response.data;
//     } catch (error) {
//         console.error('Error updating service:', error);
//         throw error;
//     }
// }

// export async function apiDeleteService({ serviceId }: { serviceId: string }): Promise<ServiceData> {
//     try {
//         const response: AxiosResponse<ServiceData> = await axios.delete(
//             `${api}/delete/${serviceId}`,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'token': token,
//                 },
//             },
//         );

//         return response.data;
//     } catch (error) {
//         console.error('Error deleting service:', error);
//         throw error;
//     }
// }