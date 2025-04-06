
import { User, Meeting, UserFormData, MeetingFormData } from '../types';

// Replace with your actual API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// API error handling
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse(response);
  },
  
  getById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return handleResponse(response);
  },
  
  create: async (userData: UserFormData): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
  
  update: async (id: number, userData: UserFormData): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Meetings API
export const meetingsApi = {
  getAll: async (): Promise<Meeting[]> => {
    const response = await fetch(`${API_BASE_URL}/meetings`);
    return handleResponse(response);
  },
  
  getById: async (id: number): Promise<Meeting> => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`);
    return handleResponse(response);
  },
  
  create: async (meetingData: MeetingFormData): Promise<Meeting> => {
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData),
    });
    return handleResponse(response);
  },
  
  update: async (id: number, meetingData: MeetingFormData): Promise<Meeting> => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData),
    });
    return handleResponse(response);
  },
  
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
