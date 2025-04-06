
export interface User {
  id?: number;
  name: string;
  email: string;
  department?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Meeting {
  id?: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  organizer: number; // User ID
  attendees?: number[]; // Array of User IDs
  createdAt?: string;
  updatedAt?: string;
}

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type MeetingFormData = Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>;
