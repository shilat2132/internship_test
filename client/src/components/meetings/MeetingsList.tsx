
import React, { useState } from 'react';
import { Meeting, User } from '../../types';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Trash, Pen } from 'lucide-react';

interface MeetingsListProps {
  meetings: Meeting[];
  users: User[];
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: number) => void;
}

const MeetingsList: React.FC<MeetingsListProps> = ({
  meetings,
  users,
  onEdit,
  onDelete,
}) => {
  const [expandedMeeting, setExpandedMeeting] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedMeeting(expandedMeeting === id ? null : id);
  };

  const getOrganizerName = (organizerId: number) => {
    const organizer = users.find(user => user.id === organizerId);
    return organizer ? organizer.name : 'Unknown';
  };

  const getAttendeeNames = (attendeeIds: number[] = []) => {
    return attendeeIds
      .map(id => users.find(user => user.id === id)?.name || 'Unknown')
      .join(', ');
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      return format(new Date(dateTimeString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };

  const formatTime = (dateTimeString: string) => {
    try {
      return format(new Date(dateTimeString), 'h:mm a');
    } catch (error) {
      return dateTimeString;
    }
  };

  const formatDate = (dateTimeString: string) => {
    try {
      return format(new Date(dateTimeString), 'MMM d, yyyy');
    } catch (error) {
      return dateTimeString;
    }
  };

  if (meetings.length === 0) {
    return (
      <div className="text-center py-10">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No meetings</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new meeting.</p>
      </div>
    );
  }

  // Group meetings by date for better organization
  const meetingsByDate: Record<string, Meeting[]> = {};
  
  meetings.forEach(meeting => {
    const date = formatDate(meeting.startTime);
    if (!meetingsByDate[date]) {
      meetingsByDate[date] = [];
    }
    meetingsByDate[date].push(meeting);
  });

  return (
    <div className="space-y-8">
      {Object.entries(meetingsByDate).map(([date, dateMeetings]) => (
        <div key={date} className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">{date}</h2>
          <div className="space-y-3">
            {dateMeetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className="bg-white border rounded-lg shadow-sm overflow-hidden"
              >
                <div 
                  className="p-4 cursor-pointer flex justify-between items-start"
                  onClick={() => toggleExpand(meeting.id as number)}
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">
                        {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-600">
                        Organizer: {getOrganizerName(meeting.organizer)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(meeting);
                      }}
                      className="text-gray-500 hover:text-blue-600 p-1"
                    >
                      <Pen className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(meeting.id as number);
                      }}
                      className="text-gray-500 hover:text-red-600 p-1"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {expandedMeeting === meeting.id && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                    {meeting.description && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Description</h4>
                        <p className="text-sm text-gray-700">{meeting.description}</p>
                      </div>
                    )}
                    
                    {meeting.location && (
                      <div className="mb-3 flex items-start">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 uppercase">Location</h4>
                          <p className="text-sm text-gray-700">{meeting.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {meeting.attendees && meeting.attendees.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Attendees</h4>
                        <p className="text-sm text-gray-700">{getAttendeeNames(meeting.attendees)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetingsList;
