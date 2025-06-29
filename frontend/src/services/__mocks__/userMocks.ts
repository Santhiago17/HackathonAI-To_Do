import type { User } from '../../types/User'
import type { CreateUserType } from '../../lib/schemas/userSchemas'

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'João',
    lastName: 'Silva Oliveira',
    name: 'João Silva Oliveira',
    birthDate: '1990-01-01'
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Souza Santos',
    name: 'Maria Souza Santos',
    birthDate: '1985-05-15'
  },
  {
    id: '3',
    firstName: 'Pedro',
    lastName: 'Santos Costa',
    name: 'Pedro Santos Costa',
    birthDate: '1992-11-20'
  },
  {
    id: '4',
    firstName: 'Ana',
    lastName: 'Oliveira Ferreira',
    name: 'Ana Oliveira Ferreira',
    birthDate: '1988-07-07'
  },
  {
    id: '5',
    firstName: 'Carlos',
    lastName: 'Mendes Rodrigues',
    name: 'Carlos Mendes Rodrigues',
    birthDate: '1995-03-25'
  }
]

export const getMockUsers = (): User[] => {
  return [...mockUsers]
}

export const getMockUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

export const createMockUser = (userData: CreateUserType): User => {
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    name: `${userData.firstName} ${userData.lastName}`.trim(),
    birthDate: userData.birthDate
  }

  mockUsers.push(newUser)
  return newUser
}
