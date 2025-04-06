
import React, { useEffect, useState } from 'react';
import { Meeting, User } from '../types';
import { meetingsApi, usersApi } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import MeetingCalendar from '../components/meetings/MeetingCalendar';
import MeetingForm from '../components/meetings/MeetingForm';
import { Plus, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [meetingsData, usersData] = await Promise.all([
          meetingsApi.getAll(),
          usersApi.getAll(),
        ]);
        setMeetings(meetingsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAddMeeting = () => {
    setSelectedMeeting(undefined);
    setIsFormOpen(true);
  };

  const handleSelectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedMeeting(undefined);
  };

  const handleSubmitForm = async (data: any) => {
    try {
      if (selectedMeeting) {
        await meetingsApi.update(selectedMeeting.id as number, data);
        toast({
          title: 'Success',
          description: 'Meeting updated successfully',
        });
        
        // Update meetings list
        setMeetings((prevMeetings) =>
          prevMeetings.map((meeting) =>
            meeting.id === selectedMeeting.id ? { ...meeting, ...data } : meeting
          )
        );
      } else {
        const newMeeting = await meetingsApi.create(data);
        toast({
          title: 'Success',
          description: 'Meeting created successfully',
        });
        
        // Add new meeting to the list
        setMeetings((prevMeetings) => [...prevMeetings, newMeeting]);
      }
      
      setIsFormOpen(false);
      setSelectedMeeting(undefined);
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast({
        title: 'Error',
        description: 'Failed to save meeting. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageContainer 
      title="Dashboard"
      action={
        <button
          onClick={handleAddMeeting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-1 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Meeting</span>
        </button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-medium">Upcoming Meetings</h2>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Next 7 days</p>
                <MeetingCalendar 
                  meetings={meetings} 
                  users={users} 
                  onSelectMeeting={handleSelectMeeting} 
                />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-medium">Team Members</h2>
              </div>
              <div className="divide-y">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="py-3 flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ))}
                {users.length > 5 && (
                  <div className="py-3 text-center">
                    <a href="/users" className="text-blue-600 text-sm hover:underline">
                      View all ({users.length}) team members
                    </a>
                  </div>
                )}
                {users.length === 0 && (
                  <div className="py-3 text-center text-gray-500">
                    No team members yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isFormOpen && (
        <MeetingForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          meeting={selectedMeeting}
          users={users}
        />
      )}
    </PageContainer>
  );
};

export default Dashboard;
