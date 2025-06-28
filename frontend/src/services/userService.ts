import type { CreateUserType } from '@/lib/schemas/userSchemas';
import { getMockUsers, getMockUserById, mockUsers } from './__mocks__/userMocks';
import type { User } from '@/types/User';

const MOCK_DELAY = 500; // ms
let nextId = mockUsers.length + 1;

export const getUsers = async (): Promise<User[]> => {
  console.log('Fetching users...');
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getMockUsers();
      console.log('Mock users fetched:', users);
      resolve(users);
    }, MOCK_DELAY);
  });
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  console.log(`Fetching user with id: ${id}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = getMockUserById(id);
      console.log('Mock user fetched:', user);
      resolve(user);
    }, MOCK_DELAY);
  });
};

export const createUser = async (data: CreateUserType): Promise<User> => {
  console.log('Creating user with data:', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        id: String(nextId++),
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        birthDate: data.birthDate,
      };
      mockUsers.push(newUser);
      console.log('Mock user created:', newUser);
      resolve(newUser);
    }, MOCK_DELAY);
  });
};
