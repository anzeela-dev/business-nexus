import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Users, Bell, Calendar as CalendarIcon, TrendingUp, AlertCircle, PlusCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));
  
  // Milestone 2 requirement: Add/modify availability slots & confirmed meetings
  const [calendarEvents, setCalendarEvents] = useState([
    { id: '1', title: 'Confirmed: Investor Pitch Meet', date: '2026-07-12', color: '#16a34a' },
    { id: '2', title: 'Availability Slot (Open)', date: '2026-07-16', color: '#4f46e5' }
  ]);

  // Pending incoming meeting requests simulation
  const [pendingMeetings, setPendingMeetings] = useState([
    { id: 'm1', investorName: 'John Investor', date: '2026-07-18', time: '11:00 AM' }
  ]);
  
  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
    }
  }, [user]);
  
  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  const handleAddSlot = () => {
    const slotDate = prompt("Enter availability slot date (YYYY-MM-DD):", "2026-07-20");
    const slotTitle = prompt("Enter slot title:", "Open Pitch Slot");
    if (slotDate && slotTitle) {
      setCalendarEvents(prev => [...prev, { id: Date.now().toString(), title: slotTitle, date: slotDate, color: '#f59e0b' }]);
      alert("Availability slot added successfully!");
    }
  };

  const handleAcceptMeeting = (id: string, name: string, date: string) => {
    setCalendarEvents(prev => [...prev, { id: Date.now().toString(), title: `Confirmed: Meet with ${name}`, date: date, color: '#16a34a' }]);
    setPendingMeetings(prev => prev.filter(m => m.id !== id));
    alert("Meeting request accepted and added to calendar!");
  };

  const handleDeclineMeeting = (id: string) => {
    setPendingMeetings(prev => prev.filter(m => m.id !== id));
    alert("Meeting request declined.");
  };
  
  if (!user) return null;
  
  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        
        <Link to="/investors">
          <Button leftIcon={<PlusCircle size={18} />}>
            Find Investors
          </Button>
        </Link>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                <h3 className="text-xl font-semibold text-primary-900">{pendingRequests.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Total Connections</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {collaborationRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <CalendarIcon size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">{calendarEvents.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">Profile Views</p>
                <h3 className="text-xl font-semibold text-success-900">24</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Main Grid for Requests and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>
            
            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No collaboration requests yet</p>
                  <p className="text-sm text-gray-500 mt-1">When investors are interested in your startup, their requests will appear here</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Incoming Meeting Requests (Accept/Decline) */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Incoming Meeting Requests</h2>
            </CardHeader>
            <CardBody>
              {pendingMeetings.length > 0 ? (
                <div className="space-y-3">
                  {pendingMeetings.map(m => (
                    <div key={m.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{m.investorName}</p>
                        <p className="text-xs text-gray-500">Date: {m.date} at {m.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-300" leftIcon={<CheckCircle size={15} />} onClick={() => handleAcceptMeeting(m.id, m.investorName, m.date)}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-700 border-red-300" leftIcon={<XCircle size={15} />} onClick={() => handleDeclineMeeting(m.id)}>
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">No pending meeting requests.</p>
              )}
            </CardBody>
          </Card>

          {/* Integrated Calendar Section */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <CalendarIcon size={18} className="text-primary-600" /> Schedule & Availability Calendar
              </h2>
              <Button size="sm" variant="outline" leftIcon={<Clock size={15} />} onClick={handleAddSlot}>
                Add Slot
              </Button>
            </CardHeader>
            <CardBody>
              <div className="bg-white p-2 rounded-lg border border-gray-100">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    end: 'dayGridMonth'
                  }}
                  events={calendarEvents}
                  height="auto"
                />
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Recommended investors */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recommended Investors</h2>
              <Link to="/investors" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </CardHeader>
            
            <CardBody className="space-y-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  showActions={false}
                />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};