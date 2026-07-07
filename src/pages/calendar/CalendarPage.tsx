import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const CalendarPage: React.FC = () => {
  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('nexus_meetings');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Sarah Pitch Meet', date: '2026-07-10', color: '#4f46e5' },
      { id: '2', title: 'TechWave AI Demo', date: '2026-07-15', color: '#16a34a' }
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    if (newEventTitle.trim()) {
      const updatedEvents = [
        ...calendarEvents,
        { id: Date.now().toString(), title: newEventTitle, date: selectedDate, color: '#4f46e5' }
      ];
      setCalendarEvents(updatedEvents);
      localStorage.setItem('nexus_meetings', JSON.stringify(updatedEvents));
      setNewEventTitle('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meeting Scheduling Calendar</h1>
        <p className="text-gray-650">Manage your availability slots and scheduled collaboration calls</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Calendar Overview</h2>
        </CardHeader>
        <CardBody>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                end: 'dayGridMonth'
              }}
              events={calendarEvents}
              dateClick={handleDateClick}
              height="auto"
            />
          </div>
        </CardBody>
      </Card>

      {/* Modal Popup for adding slots */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Availability Slot</h3>
            <p className="text-sm text-gray-600 mb-4">Selected Date: <span className="font-medium text-primary-600">{selectedDate}</span></p>
            
            <input
              type="text"
              placeholder="e.g., Pitch Discussion"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4 text-gray-900"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
            />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddEvent}>
                Save Slot
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};