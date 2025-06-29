import type { CreateUserType } from '@/lib/schemas/userSchemas'
import type { User } from '@/types/User'
import { api } from './api'
import { mockConfig } from './__mocks__/mockConfig'
import { getMockUsers, createMockUser } from './__mocks__/userMocks'

interface BackendUser {
  id: number
  firstName: string
  lastName: string
  birthDate: string
  age?: number
}

const mapBackendToUser = (backendUser: BackendUser): User => {
  return {
    id: backendUser.id.toString(),
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    name: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
    birthDate: backendUser.birthDate
  }
}

// Simula atraso de rede para mocks
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getUsers = async (): Promise<User[]> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay)
    return getMockUsers()
  }

  try {
    const response = await api.get('/users')
    return response.data.map(mapBackendToUser)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    throw error
  }
}

export const createUser = async (data: CreateUserType): Promise<User> => {
  if (mockConfig.useMockData) {
    await delay(mockConfig.apiDelay)
    const newUser = createMockUser(data)
    console.log('Usuário criado com sucesso (mock):', newUser)
    return newUser
  }

  try {
    const response = await api.post('/users', data)
    console.log('Usuário criado com sucesso:', response.data)
    return mapBackendToUser(response.data)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    throw error
  }
}
