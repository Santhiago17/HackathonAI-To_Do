import axios from 'axios'

// Se estivermos em desenvolvimento e não há VITE_BASE_URL, usa o proxy
const isDevelopment = import.meta.env.DEV
const baseURL = import.meta.env.VITE_BASE_URL || (isDevelopment ? '/api' : 'http://localhost:8080/api')

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro de resposta do servidor
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Erro de rede
      console.error('Network Error:', 'Unable to connect to server')
    } else {
      // Erro de configuração
      console.error('Request Error:', error.message)
    }
    return Promise.reject(error)
  }
)
