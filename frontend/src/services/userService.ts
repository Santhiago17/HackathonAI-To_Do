import type { CreateUserType } from '@/lib/schemas/userSchemas'
import type { User } from '@/types/User'
import { api } from './api'

interface BackendUser {
  id: number
  firstName: string
  lastName: string
  birthDate: string
  age?: number
}

// Função para mapear resposta do backend para User do frontend
const mapBackendToUser = (backendUser: BackendUser): User => {
  return {
    id: backendUser.id.toString(),
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    name: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
    birthDate: backendUser.birthDate
  }
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users')
    return response.data.map(mapBackendToUser)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    throw error
  }
}

export const createUser = async (data: CreateUserType): Promise<User> => {
  try {
    const response = await api.post('/users', data)
    console.log('Usuário criado com sucesso:', response.data)
    return mapBackendToUser(response.data)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    throw error
  }
}
