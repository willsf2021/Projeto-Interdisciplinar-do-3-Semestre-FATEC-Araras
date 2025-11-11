// hooks/useApi.js
import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const { updateActivity, refreshToken } = useAuth();

  const apiFetch = async (url, options = {}) => {
    updateActivity();
   
    let response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    console.log(options)
    if (response.status === 401) {
     
      try {
        const refreshResult = await refreshToken();
        
        if (refreshResult.success) {
         
          response = await fetch(url, {
            ...options,
            credentials: 'include',
          });
        } else {
          throw new Error('Não foi possível renovar a sessão');
        }
      } catch (error) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
    }
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    return response;
  };

  const apiFetchJson = async (url, options = {}) => {
    const response = await apiFetch(url, options);
    return await response.json();
  };

  return { apiFetch, apiFetchJson };
};