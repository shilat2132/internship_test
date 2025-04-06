
import React from 'react';
import { User } from '../../types';
import { Pen, Trash, User as UserIcon } from 'lucide-react';

interface UsersListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, onEdit, onDelete }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-10">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No users</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new user.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-900">Name</th>
            <th className="px-6 py-4 font-medium text-gray-900">Email</th>
            <th className="px-6 py-4 font-medium text-gray-900">Department</th>
            <th className="px-6 py-4 font-medium text-gray-900">Role</th>
            <th className="px-6 py-4 font-medium text-gray-900 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {user.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div>{user.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.department || '-'}</td>
              <td className="px-6 py-4">{user.role || '-'}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-gray-500 hover:text-blue-600 p-1"
                  >
                    <Pen className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id as number)}
                    className="text-gray-500 hover:text-red-600 p-1"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
