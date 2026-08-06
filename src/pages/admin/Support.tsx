import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Clock, CheckCircle, AlertCircle, Phone, X, Send, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

export function Support() {
  const { t } = useLanguage();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const loadTickets = () => {
    const loadedTickets = JSON.parse(localStorage.getItem('wcs_support_tickets') || '[]');
    setTickets(loadedTickets.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    loadTickets();
    const handleStorageChange = () => loadTickets();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const searchMatch = (ticket.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                       (ticket.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (ticket.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'All') return searchMatch;
    return searchMatch && ticket.status === filter;
  });

  const handleReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const newReply = {
      id: Date.now().toString(),
      sender: 'admin',
      message: replyMessage,
      createdAt: new Date().toISOString()
    };

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: t.status === 'Closed' ? 'Open' : t.status, // Reopen if closed
          messages: [...(t.messages || []), newReply],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });

    localStorage.setItem('wcs_support_tickets', JSON.stringify(updatedTickets));
    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id));
    setReplyMessage('');
  };

  const handleCloseTicket = (ticketId: string) => {
    if(confirm('Are you sure you want to close this ticket?')) {
      const updatedTickets = tickets.map(t => {
        if (t.id === ticketId) {
          return { ...t, status: 'Closed', updatedAt: new Date().toISOString() };
        }
        return t;
      });
      localStorage.setItem('wcs_support_tickets', JSON.stringify(updatedTickets));
      setTickets(updatedTickets);
      if(selectedTicket?.id === ticketId) {
        setSelectedTicket(updatedTickets.find(t => t.id === ticketId));
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Pending': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Closed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  if (selectedTicket) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col -mt-4">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <button onClick={() => setSelectedTicket(null)} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors font-medium text-sm">
            <X className="w-4 h-4" />
            Back to Tickets
          </button>
          <div className="flex items-center gap-3">
            <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getStatusColor(selectedTicket.status))}>
              {selectedTicket.status}
            </span>
            {selectedTicket.status !== 'Closed' && (
              <button onClick={() => handleCloseTicket(selectedTicket.id)} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors">
                Mark as Closed
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          <div className="lg:col-span-2 flex flex-col bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-neutral-100 shrink-0">
              <h3 className="text-xl font-black text-neutral-900 mb-1">{selectedTicket.subject}</h3>
              <div className="text-sm text-neutral-500 font-medium">Ticket ID: {selectedTicket.id} • {new Date(selectedTicket.createdAt).toLocaleString()}</div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {(selectedTicket.messages || []).map((msg: any, idx: number) => (
                <div key={idx} className={cn("flex gap-4 max-w-[85%]", msg.sender === 'admin' ? "ml-auto flex-row-reverse" : "")}>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold", 
                    msg.sender === 'admin' ? "bg-indigo-100 text-indigo-600" : "bg-neutral-100 text-neutral-600"
                  )}>
                    {msg.sender === 'admin' ? 'A' : selectedTicket.customerName.charAt(0)}
                  </div>
                  <div className={cn("p-4 rounded-2xl", 
                    msg.sender === 'admin' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-neutral-50 border border-neutral-100 rounded-tl-none"
                  )}>
                    <div className={cn("text-xs font-bold mb-1 opacity-70", msg.sender === 'admin' ? "text-indigo-100" : "text-neutral-500")}>
                      {msg.sender === 'admin' ? 'Admin' : selectedTicket.customerName} • {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="whitespace-pre-wrap text-sm">{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedTicket.status !== 'Closed' && (
              <div className="p-4 border-t border-neutral-100 bg-neutral-50 shrink-0">
                <div className="flex items-end gap-3 relative">
                  <textarea 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply here..."
                    className="flex-1 min-h-[80px] max-h-[200px] resize-y p-4 pr-16 bg-white border border-neutral-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm"
                  />
                  <button 
                    onClick={handleReply}
                    disabled={!replyMessage.trim()}
                    className="absolute right-4 bottom-4 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-neutral-400" />
                Customer Details
              </h4>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-neutral-500 font-medium mb-1">Name</div>
                  <div className="font-bold text-neutral-900">{selectedTicket.customerName}</div>
                </div>
                <div>
                  <div className="text-neutral-500 font-medium mb-1">Phone</div>
                  <div className="font-bold text-neutral-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    {selectedTicket.phone}
                  </div>
                </div>
                {selectedTicket.websiteName && (
                  <div>
                    <div className="text-neutral-500 font-medium mb-1">Website</div>
                    <div className="font-bold text-indigo-600">{selectedTicket.websiteName}</div>
                  </div>
                )}
                {selectedTicket.orderId && (
                  <div>
                    <div className="text-neutral-500 font-medium mb-1">Order ID</div>
                    <div className="font-bold text-neutral-900 font-mono">{selectedTicket.orderId}</div>
                  </div>
                )}
              </div>
            </div>
            
            {selectedTicket.type === 'WhatsApp Support' && (
              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  WhatsApp Request
                </h4>
                <p className="text-sm text-emerald-700 mb-4">
                  Customer requested support via WhatsApp for down payment processing.
                </p>
                <a 
                  href={`https://wa.me/${selectedTicket.phone}?text=Hello ${selectedTicket.customerName}, this is Web Code Studio. You requested support regarding your down payment for order ${selectedTicket.orderId}. How can we help you?`}
                  target="_blank" rel="noreferrer"
                  className="block w-full py-2.5 bg-emerald-600 text-white text-center rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors"
                >
                  Message on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Support Tickets</h2>
          <p className="text-neutral-500 font-medium mt-1">Manage customer inquiries and support requests</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search tickets by ID, subject, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600/20 min-w-[150px]">
            <option value="All">All Tickets</option>
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              onClick={() => setSelectedTicket(ticket)}
              className="group flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-5 bg-white border border-neutral-100 rounded-2xl hover:border-indigo-600/30 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex gap-4 items-start">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  ticket.type === 'WhatsApp Support' ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                )}>
                  {ticket.type === 'WhatsApp Support' ? <Phone className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                      {ticket.subject}
                    </h3>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider", getStatusColor(ticket.status))}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-neutral-500 flex items-center gap-4 flex-wrap">
                    <span>ID: <span className="font-mono">{ticket.id}</span></span>
                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {ticket.customerName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(ticket.updatedAt || ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="text-center py-12 text-neutral-500 font-medium">
              No tickets found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
