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
