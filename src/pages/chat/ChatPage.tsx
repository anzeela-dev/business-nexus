import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Phone, Video, Info, Smile } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { useAuth } from '../../context/AuthContext';
import { Message } from '../../types';
import { findUserById } from '../../data/users';
import { getMessagesBetweenUsers, sendMessage, getConversationsForUser } from '../../data/messages';
import { MessageCircle } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false); // Typing state simulation layer
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  const chatPartner = userId ? findUserById(userId) : null;
  
  useEffect(() => {
    if (currentUser) {
      setConversations(getConversationsForUser(currentUser.id));
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (currentUser && userId) {
      setMessages(getMessagesBetweenUsers(currentUser.id, userId));
      setIsTyping(false); // Reset typing status on switch
    }
  }, [currentUser, userId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser || !userId) return;
    
    // 1. Send our user's message
    const message = sendMessage({
      senderId: currentUser.id,
      receiverId: userId,
      content: newMessage
    });
    
    const contextText = newMessage.toLowerCase();
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update sidebar layout states
    setConversations(getConversationsForUser(currentUser.id));

    // 2. Automated Smart Bot Reply Simulation Engine
    setIsTyping(true);
    
    setTimeout(() => {
      let replyText = "Thank you for the update. Let's schedule a call to synchronize on the terminal milestones next week.";
      
      // Smart contextual trigger keywords matching
      if (contextText.includes('hello') || contextText.includes('hi')) {
        replyText = `Hello! Glad to connect here. I was reviewing the platform pipeline details. What are your thoughts on the active milestones?`;
      } else if (contextText.includes('pitch') || contextText.includes('deck') || contextText.includes('startup')) {
        replyText = `I have analyzed the investment framework documentation. The financial metrics and equity cap space align well with our current ecosystem portfolio.`;
      } else if (contextText.includes('deal') || contextText.includes('stripe') || contextText.includes('payment')) {
        replyText = `Excellent, the escrow transaction channels are secure. Our legal team will dispatch the signed closing document matrix shortly.`;
      }

      const simulatedReply = sendMessage({
        senderId: userId, // Sent by chat partner
        receiverId: currentUser.id,
        content: replyText
      });

      setMessages(prev => [...prev, simulatedReply]);
      setIsTyping(false);
      
      // Re-sync sidebar notifications state layout
      setConversations(getConversationsForUser(currentUser.id));
    }, 1500);
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in">
      {/* Conversations sidebar */}
      <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-gray-200">
        <ChatUserList conversations={conversations} />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {chatPartner ? (
          <>
            {/* Chat header */}
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Avatar
                  src={chatPartner.avatarUrl}
                  alt={chatPartner.name}
                  size="md"
                  status={chatPartner.isOnline || isTyping ? 'online' : 'offline'}
                  className="mr-3"
                />
                
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{chatPartner.name}</h2>
                  <p className="text-sm text-gray-500">
                    {isTyping ? 'Typing mechanical logs...' : chatPartner.isOnline ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="rounded-full p-2" aria-label="Voice call" onClick={() => alert("Initializing simulated encrypted audio stream socket...")}><Phone size={18} /></Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2" aria-label="Video call" onClick={() => alert("Opening secure terminal peer video viewport...")}><Video size={18} /></Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2" aria-label="Info"><Info size={18} /></Button>
              </div>
            </div>
            
            {/* Messages container */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map(message => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isCurrentUser={message.senderId === currentUser.id}
                    />
                  ))}

                  {/* Animated Chat Typing Pulse Indicator */}
                  {isTyping && (
                    <div className="flex items-center space-x-2 bg-white border border-gray-100 p-3 rounded-2xl max-w-[200px] shadow-sm animate-pulse">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">Partner typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <MessageCircle size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                  <p className="text-gray-500 mt-1">Send a message to start the conversation</p>
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Button type="button" variant="ghost" size="sm" className="rounded-full p-2" aria-label="Add emoji"><Smile size={20} /></Button>
                
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  fullWidth
                  className="flex-1"
                  disabled={isTyping}
                />
                
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newMessage.trim() || isTyping}
                  className="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <MessageCircle size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-700">Select a conversation</h2>
            <p className="text-gray-500 mt-2 text-center">Choose a contact from the list to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};