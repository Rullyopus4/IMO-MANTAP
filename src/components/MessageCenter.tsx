import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Send, RefreshCw } from 'lucide-react';
import { getAllUsers, getUserMessages, sendMessage } from '../data/mockData';
import { User, Message } from '../types';

const MessageCenter: React.FC = () => {
  const { currentUser, isPatient } = useAuth();
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;

    // For patients, only show their assigned nurse as contact
    if (isPatient()) {
      const allUsers = getAllUsers();
      const nurseId = currentUser.nurseId;
      const nurse = allUsers.find(user => user.id === nurseId);
      
      if (nurse) {
        setContacts([nurse]);
        setSelectedContact(nurse);
      }
    } else {
      // For nurses and admins, show all relevant contacts
      let relevantContacts: User[];
      
      if (currentUser.role === 'nurse') {
        // Nurses see their patients
        const patientIds = currentUser.patients || [];
        relevantContacts = getAllUsers().filter(user => 
          patientIds.includes(user.id) || user.role === 'admin'
        );
      } else {
        // Admins see all users except other admins
        relevantContacts = getAllUsers().filter(user => 
          user.role !== 'admin' || user.id !== currentUser.id
        );
      }
      
      setContacts(relevantContacts);
      if (relevantContacts.length > 0 && !selectedContact) {
        setSelectedContact(relevantContacts[0]);
      }
    }
  }, [currentUser, isPatient]);

  useEffect(() => {
    if (currentUser && selectedContact) {
      loadMessages();
    }
  }, [currentUser, selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    if (!currentUser || !selectedContact) return;
    
    setLoading(true);
    
    // Get all messages for current user
    const userMessages = getUserMessages(currentUser.id);
    
    // Filter messages between current user and selected contact
    const relevantMessages = userMessages.filter(
      message => 
        (message.senderId === currentUser.id && message.receiverId === selectedContact.id) ||
        (message.senderId === selectedContact.id && message.receiverId === currentUser.id)
    );
    
    // Sort by creation time
    relevantMessages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    setMessages(relevantMessages);
    setLoading(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !selectedContact || !newMessage.trim()) return;
    
    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      receiverId: selectedContact.id,
      content: newMessage.trim(),
      read: false,
      createdAt: new Date(),
    };
    
    sendMessage(message);
    setNewMessage('');
    
    // Add message to the chat
    setMessages(prev => [...prev, message]);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pusat Pesan</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Contact list */}
          <div className="md:col-span-1 border-r border-gray-200">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-700">Kontak</h2>
            </div>
            <ul className="divide-y divide-gray-200 overflow-y-auto max-h-96">
              {contacts.map(contact => (
                <li key={contact.id}>
                  <button
                    className={`w-full px-4 py-3 flex items-center hover:bg-gray-50 focus:outline-none ${
                      selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="font-medium text-blue-900">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">
                        {contact.role === 'nurse' ? 'Perawat' : contact.role === 'patient' ? 'Pasien' : 'Admin'}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
              
              {contacts.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-gray-500">
                  Tidak ada kontak yang tersedia
                </li>
              )}
            </ul>
          </div>
          
          {/* Chat area */}
          <div className="md:col-span-3 flex flex-col h-[calc(100vh-12rem)]">
            {selectedContact ? (
              <>
                {/* Chat header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="font-medium text-blue-900">
                        {selectedContact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{selectedContact.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedContact.role === 'nurse' ? 'Perawat' : selectedContact.role === 'patient' ? 'Pasien' : 'Admin'}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={loadMessages}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <p className="text-gray-500">Belum ada pesan</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Mulai percakapan dengan mengirim pesan
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(message => {
                        const isCurrentUser = message.senderId === currentUser.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                                isCurrentUser
                                  ? 'bg-blue-600 text-white rounded-br-none'
                                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {formatTimestamp(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messageEndRef} />
                    </div>
                  )}
                </div>
                
                {/* Message input */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  <form onSubmit={handleSendMessage} className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ketik pesan..."
                      className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md border-gray-300"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Kirim
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <p className="text-gray-500">Pilih kontak untuk mulai mengobrol</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;