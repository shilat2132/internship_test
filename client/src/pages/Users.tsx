
import React, { useEffect, useState } from 'react';
import { User, UserFormData } from '../types';
import { usersApi } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import UsersList from '../components/users/UsersList';
import UserForm from '../components/users/UserForm';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await usersApi.getAll();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersApi.delete(id);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete user. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(undefined);
  };

  const handleSubmitForm = async (data: UserFormData) => {
    try {
      if (selectedUser) {
        await usersApi.update(selectedUser.id as number, data);
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
        
        // Update users list
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, ...data } : user
          )
        );
      } else {
        const newUser = await usersApi.create(data);
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
        
        // Add new user to the list
        setUsers((prevUsers) => [...prevUsers, newUser]);
      }
      
      setIsFormOpen(false);
      setSelectedUser(undefined);
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: 'Error',
        description: 'Failed to save user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageContainer 
      title="Users"
      action={
        <button
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-1 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>New User</span>
        </button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <UsersList 
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}
      
      {isFormOpen && (
        <UserForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          user={selectedUser}
        />
      )}
    </PageContainer>
  );
};

export default Users;
