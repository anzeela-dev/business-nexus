import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { Entrepreneur } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // 1. Confirmed Calendar Events State (Loaded from localStorage)
  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('nexus_meetings');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Sarah Pitch Meet', date: '2026-07-10', color: '#4f46e5' },
      { id: '2', title: 'TechWave AI Demo', date: '2026-07-15', color: '#16a34a' }
    ];
  });

  // 2. Pending Requests State for Demo
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'req_1', title: 'Pitch Discussion', entrepreneur: 'Sarah Johnson', date: '2026-07-20' },
    { id: 'req_2', title: 'TechWave AI Demo', entrepreneur: 'Zain Ahmed', date: '2026-07-22' }
  ]);

  // 3. Action Handler: Accept Request (Adds to Calendar with Green Color)
  const handleAcceptRequest = (req: any) => {
    const newEvent = {
      id: req.id,
      title: `${req.title} with ${req.entrepreneur}`,
      date: req.date,
      color: '#16a34a' // Success Green Color
    };

    const updatedEvents = [...calendarEvents, newEvent];
    setCalendarEvents(updatedEvents);
    localStorage.setItem('nexus_meetings', JSON.stringify(updatedEvents));

    // Remove from pending list
    setPendingRequests(pendingRequests.filter(r => r.id !== req.id));
  };

  // 4. Action Handler: Decline Request
  const handleDeclineRequest = (id: string) => {
    if (window.confirm("Are you sure you want to decline this meeting request?")) {
      setPendingRequests(pendingRequests.filter(r => r.id !== id));
    }
  };

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

  const handleEventClick = (clickInfo: any) => {
    if (window.confirm(`Do you want to delete the meeting "${clickInfo.event.title}"?`)) {
      const updatedEvents = calendarEvents.filter(
        (e: any) => e.id !== clickInfo.event.id && e.title !== clickInfo.event.title
      );
      setCalendarEvents(updatedEvents);
      localStorage.setItem('nexus_meetings', JSON.stringify(updatedEvents));
    }
  };

  if (!user) return null;
  
  const sentRequests = getRequestsFromInvestor(user.id);
  
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' || 
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustries.length === 0 || 
      selectedIndustries.includes(entrepreneur.industry);
    
    return matchesSearch && matchesIndustry;
  });
  
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prevSelected => 
      prevSelected.includes(industry)
        ? prevSelected.filter(i => i !== industry)
        : [...prevSelected, industry]
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>
        
        <Link to="/entrepreneurs">
          <Button leftIcon={<PlusCircle size={18} />}>
            View All Startups
          </Button>
        </Link>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <Badge
                  key={industry}
                  variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Your Connections</p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {sentRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Entrepreneurs grid */}
      <div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
          </CardHeader>
          
          <CardBody>
            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map(entrepreneur => (
                  <EntrepreneurCard
                    key={entrepreneur.id}
                    entrepreneur={entrepreneur}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No startups match your filters</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustries([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Meeting Scheduling Calendar Section */}
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Meeting Schedule & Calendar</h2>
              <p className="text-sm text-gray-600">Manage your availability slots and investor-entrepreneur meeting requests</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Side: Actions and Slots Status */}
              <div className="space-y-4 lg:col-span-1">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button 
  variant="primary" 
  fullWidth 
  size="sm"
  onClick={() => {
    // Aaj ki date ko default select kar ke modal open karein ge
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setIsModalOpen(true);
  }}
>
  + Add Availability Slot
</Button>
                  </div>
                </div>
                
                {/* Dynamic Pending Requests Section */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">Pending Requests</h3>
                  <div className="text-xs text-gray-500 space-y-3">
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((req) => (
                        <div key={req.id} className="p-2 bg-white rounded shadow-sm border border-orange-100 animate-fade-in">
                          <p className="font-medium text-gray-700">{req.title}</p>
                          <p>With: {req.entrepreneur}</p>
                          <p className="text-gray-400">Date: {req.date}</p>
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={() => handleAcceptRequest(req)}
                              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-[10px] font-medium transition-colors"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleDeclineRequest(req.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-[10px] font-medium transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic py-2">No pending requests</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Actual FullCalendar Component */}
              <div className="lg:col-span-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm custom-calendar">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                  }}
                  events={calendarEvents}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick} 
                  height="auto"
                />
              </div>

              {/* Interactive Modal Popup */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                    <h3 className="text-lg font-semibold text-gray-950 mb-2">Add Schedule / Slot</h3>
                    <p className="text-sm text-gray-600 mb-4">Date Selected: <span className="font-medium text-primary-600">{selectedDate}</span></p>
                    
                    <input
                      type="text"
                      placeholder="e.g., Follow-up with TechWave"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4 text-gray-900"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleAddEvent}>
                        Save Event
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};