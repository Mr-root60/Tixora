// mobile/src/api/client.js
import axios from 'axios';

// ⚠️ À MODIFIER selon votre cas :
//  - Émulateur Android :        http://10.0.2.2:8000/api/v1
//  - Simulateur iOS :           http://localhost:8000/api/v1
//  - Vrai téléphone (Expo Go) : http://ADRESSE_IP_DE_VOTRE_PC:8000/api/v1
export const API_URL = 'http://192.168.1.10:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Ajoute (ou retire) le badge JWT sur TOUTES les requêtes suivantes.
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// Transforme une erreur axios en message lisible pour l'utilisateur.
export function getErrorMessage(error) {
  if (error.response) {
    const detail = error.response.data && error.response.data.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      // erreur 422 : une liste de champs invalides
      const first = detail[0];
      const field = first.loc ? first.loc[first.loc.length - 1] : '';
      return `${field} : ${first.msg}`;
    }
    return `Erreur serveur (${error.response.status})`;
  }
  if (error.request) {
    return "Impossible de joindre le serveur. Vérifiez l'adresse API_URL et le Wi-Fi.";
  }
  return 'Une erreur est survenue';
}
