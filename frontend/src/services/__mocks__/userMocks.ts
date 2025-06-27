// src/__mocks__/userMocks.ts

import type { User } from '../../types/User'; // <<< IMPORTANDO User DO LOCAL CORRETO

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'João', // <<< Adicionado
    lastName: 'Silva Oliveira', // <<< Adicionado
    name: 'João Silva Oliveira',
    birthDate: '19900101', // <<< Adicionado no formato COBOL
    // email: 'joao.oliveira@mainframe.com' // Remova se não estiver no tipo User
  },
  {
    id: '2',
    firstName: 'Maria', // <<< Adicionado
    lastName: 'Souza Santos', // <<< Adicionado
    name: 'Maria Souza Santos',
    birthDate: '19850515', // <<< Adicionado
    // email: 'maria.souza@datacenter.com'
  },
  {
    id: '3',
    firstName: 'Pedro', // <<< Adicionado
    lastName: 'Santos Costa', // <<< Adicionado
    name: 'Pedro Santos Costa',
    birthDate: '19921120', // <<< Adicionado
    // email: 'pedro.costa@legacy.com'
  },
  {
    id: '4',
    firstName: 'Ana', // <<< Adicionado
    lastName: 'Oliveira Ferreira', // <<< Adicionado
    name: 'Ana Oliveira Ferreira',
    birthDate: '19880707', // <<< Adicionado
    // email: 'ana.ferreira@cobolsystems.com'
  },
  {
    id: '5',
    firstName: 'Carlos', // <<< Adicionado
    lastName: 'Mendes Rodrigues', // <<< Adicionado
    name: 'Carlos Mendes Rodrigues',
    birthDate: '19950325', // <<< Adicionado
    // email: 'carlos.rodrigues@mainframepro.com'
  }
];

export const getMockUsers = (): User[] => {
  return [...mockUsers];
};

export const getMockUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};