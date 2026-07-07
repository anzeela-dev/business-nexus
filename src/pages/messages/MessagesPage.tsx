import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getConversationsForUser } from '../../data/messages';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { MessageCircle, Radio, ShieldCheck } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Real-time state management for handling simulation payload updates
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch data repository context references dynamically
      const initialConversations = getConversationsForUser(user.id);
      setConversations(initialConversations);
      
      // Simulate real-time WebSockets/SSE server handshake connection sequence
      const networkTimeout = setTimeout(() => {
        setIsLiveConnected(true);
      }, 800);

      return () => clearTimeout(networkTimeout);
    }
  }, [user]);

  if (!user) return null;

  // Intercepting function simulating dynamic injection of real-time incoming text threads
  const handleSimulateIncomingMessage = () => {
    if (conversations.length === 0) return;
    
    // Select the first conversation to append a mock state update packet
    const updatedConversations = [...conversations];
    if (updatedConversations[0]) {
      updatedConversations[0] = {
        ...updatedConversations[0],
        lastMessage: {
          ...updatedConversations[0].lastMessage,
          text: "Term Sheet parameters updated on the secure terminal layer. Please review.",
          timestamp: new Date().toISOString()
        },
        unreadCount: (updatedConversations[0].unreadCount || 0) + 1
      };
      setConversations(updatedConversations);
      alert("Real-time Gateway Simulation: New incoming transmission parsed from Investor node.");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Real-time Status Notification Hub Header block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Secure Messaging Terminal
          </h1>
          <p className="text-gray-600 text-sm">Communicate seamlessly with venture partners and founders</p>
        </div>
        
        <div className="flex items-center gap-2">
          {isLiveConnected ? (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
              <Radio size={12} className="animate-pulse text-emerald-500" /> Gateway Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
              Connecting...
            </span>
          )}

          {conversations.length > 0 && (
            <button
              onClick={handleSimulateIncomingMessage}
              className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-md transition-all"
            >
              Simulate Message
            </button>
          )}
        </div>
      </div>

      <div className="h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {conversations.length > 0 ? (
          <ChatUserList conversations={conversations} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <MessageCircle size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900">No messages yet</h2>
            <p className="text-gray-600 text-center mt-2 text-sm max-w-sm">
              Start connecting with entrepreneurs and investors to begin terminal peer conversations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};