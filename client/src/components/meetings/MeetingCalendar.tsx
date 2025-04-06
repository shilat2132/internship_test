
import React from 'react';
import { Meeting, User } from '../../types';
import { format, parseISO, startOfWeek, addDays, isSameDay } from 'date-fns';

interface MeetingCalendarProps {
  meetings: Meeting[];
  users: User[];
  onSelectMeeting: (meeting: Meeting) => void;
}

interface MeetingWithTime {
  meeting: Meeting;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
}

const MeetingCalendar: React.FC<MeetingCalendarProps> = ({
  meetings,
  users,
  onSelectMeeting,
}) => {
  const days = React.useMemo(() => {
    const today = new Date();
    const startDay = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
    return Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
  }, []);

  const getOrganizerName = (organizerId: number) => {
    const organizer = users.find(user => user.id === organizerId);
    return organizer ? organizer.name : 'Unknown';
  };

  const getMeetingsForDay = (date: Date): MeetingWithTime[] => {
    return meetings
      .filter(meeting => {
        const meetingDate = parseISO(meeting.startTime);
        return isSameDay(meetingDate, date);
      })
      .map(meeting => {
        const startDate = parseISO(meeting.startTime);
        const endDate = parseISO(meeting.endTime);
        const startHour = startDate.getHours();
        const startMinute = startDate.getMinutes();
        const durationMinutes = 
          (endDate.getHours() * 60 + endDate.getMinutes()) - 
          (startHour * 60 + startMinute);
        
        return {
          meeting,
          startHour,
          startMinute,
          durationMinutes
        };
      });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7 border-b">
        {days.map((day, i) => (
          <div 
            key={i}
            className="py-2 text-center border-r last:border-r-0 font-medium"
          >
            <p className="text-xs text-gray-500">{format(day, 'EEE')}</p>
            <p className="text-sm">{format(day, 'd')}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 h-96 overflow-y-auto">
        {days.map((day, dayIndex) => {
          const dayMeetings = getMeetingsForDay(day);
          
          return (
            <div 
              key={dayIndex}
              className="border-r last:border-r-0 relative p-1"
            >
              {dayMeetings.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                  No meetings
                </div>
              ) : (
                <div className="space-y-1">
                  {dayMeetings.map((meetingInfo, i) => {
                    const { meeting, startHour, startMinute } = meetingInfo;
                    return (
                      <div 
                        key={i}
                        onClick={() => onSelectMeeting(meeting)}
                        className="bg-blue-100 border-l-4 border-blue-500 p-2 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                      >
                        <p className="text-xs font-medium truncate">{meeting.title}</p>
                        <p className="text-xs text-gray-600">
                          {startHour}:{startMinute.toString().padStart(2, '0')}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {getOrganizerName(meeting.organizer)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingCalendar;
