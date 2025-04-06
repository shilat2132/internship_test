
import React, { useEffect, useState } from 'react';
import { Meeting, User, MeetingFormData } from '../types';
import { meetingsApi, usersApi } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import MeetingsList from '../components/meetings/MeetingsList';
import MeetingForm from '../components/meetings/MeetingForm';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Meetings: React.FC = () => {
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
        console.error('Error fetching meetings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load meetings. Please try again.',
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

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsFormOpen(true);
  };

  const handleDeleteMeeting = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await meetingsApi.delete(id);
        setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.id !== id));
        toast({
          title: 'Success',
          description: 'Meeting deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting meeting:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete meeting. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedMeeting(undefined);
  };

  const handleSubmitForm = async (data: MeetingFormData) => {
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
      title="Meetings"
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
        <MeetingsList 
          meetings={meetings}
          users={users}
          onEdit={handleEditMeeting}
          onDelete={handleDeleteMeeting}
        />
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

export default Meetings;
