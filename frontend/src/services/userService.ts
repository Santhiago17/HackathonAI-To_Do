// import { api } from './api'; // Corrected import - Will be used when actual API calls are implemented
import type { CreateUserType, UpdateUserType } from '@/lib/schemas/userSchemas';

// Define a User type for responses, adjust as needed based on your backend
export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user fields if necessary
}

const MOCK_DELAY = 500; // ms

// Mock data store
let mockUsers: User[] = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com' },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com' },
];
let nextId = 4;

export const getUsers = async (): Promise<User[]> => {
  console.log('Fetching users...');
  // Replace with actual API call below, once backend is ready
  // const response = await api.get<User[]>('/users');
  // return response.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock users fetched:', mockUsers);
      resolve([...mockUsers]);
    }, MOCK_DELAY);
  });
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  console.log(`Fetching user with id: ${id}...`);
  // Replace with actual API call below, once backend is ready
  // const response = await api.get<User>(`/users/${id}`);
  // return response.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.id === id);
      console.log('Mock user fetched:', user);
      resolve(user);
    }, MOCK_DELAY);
  });
};

export const createUser = async (data: CreateUserType): Promise<User> => {
  console.log('Creating user with data:', data);
  // Replace with actual API call below, once backend is ready
  // const response = await api.post<User>('/users', data);
  // return response.data;
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = { ...data, id: String(nextId++) };
      mockUsers.push(newUser);
      console.log('Mock user created:', newUser);
      resolve(newUser);
    }, MOCK_DELAY);
  });
};

export const updateUser = async (id: string, data: UpdateUserType): Promise<User | undefined> => {
  console.log(`Updating user with id: ${id} and data:`, data);
  // Replace with actual API call below, once backend is ready
  // const response = await api.put<User>(`/users/${id}`, data);
  // return response.data;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
        console.log('Mock user updated:', mockUsers[userIndex]);
        resolve(mockUsers[userIndex]);
      } else {
        console.log('Mock user not found for update.');
        reject(new Error('User not found'));
      }
    }, MOCK_DELAY);
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  console.log(`Deleting user with id: ${id}`);
  // Replace with actual API call below, once backend is ready
  // await api.delete(`/users/${id}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockUsers.length;
      mockUsers = mockUsers.filter(u => u.id !== id);
      if (mockUsers.length < initialLength) {
        console.log('Mock user deleted.');
        resolve();
      } else {
        console.log('Mock user not found for deletion.');
        reject(new Error('User not found'));
      }
    }, MOCK_DELAY);
  });
};
