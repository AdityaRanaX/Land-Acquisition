import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MessageSquare, Send, Paperclip, CheckCheck, Clock, User, Shield } from 'lucide-react';

export const AgencyCommunication = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'District Collector Office (Pune)',
      senderRole: 'Special Land Acquisition Officer (SLAO)',
      text: 'Section 15 hearing records for Package 4A (Wagholi) have been finalized. 12 objections resolved, 2 referred to design team for curve easement.',
      time: 'Yesterday at 4:15 PM',
      isMe: false
    },
    {
      id: 2,
      sender: 'NHAI Project Director (Pune PIU)',
      senderRole: 'Requiring Agency',
      text: 'Noted. We have deposited the escrow advance of ₹450 Cr for Section 23 awards into the designated State Treasury account.',
      time: 'Today at 10:30 AM',
      isMe: true
    }
  ]);

  const [inputVal, setInputVal] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'NHAI Project Director (Pune PIU)',
        senderRole: 'Requiring Agency',
        text: inputVal,
        time: 'Just now',
        isMe: true
      }
    ]);
    setInputVal('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-bistre tracking-tight">Inter-Agency Direct Dispatch & Comm Desk</h1>
        <p className="text-xs text-text-muted mt-0.5">
          Official coordination channel between NHAI Project Implementation Unit (PIU) and District Collector SLAO
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Threads */}
        <div className="lg:col-span-1 space-y-3">
          <Card title="Active Communication Channels">
            <div className="space-y-2">
              {[
                { title: 'Pune SLAO - Package 4A Desk', unread: 0, active: true, badge: 'ACTIVE' },
                { title: 'Nashik Collectorate - Spur Requisition', unread: 2, active: false, badge: 'NEW NOTICE' },
                { title: 'State Revenue Department (DoLR)', unread: 0, active: false, badge: 'POLICY' }
              ].map((c, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    c.active ? 'bg-kobicha/10 border-kobicha' : 'bg-page border-chamoisee/20 hover:border-chamoisee/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-bistre text-xs">{c.title}</h4>
                    <Badge status={c.badge === 'ACTIVE' ? 'VERIFIED' : 'PENDING'} />
                  </div>
                  <p className="text-[11px] text-text-muted mt-1">Direct Encrypted Govt Channel</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          <Card title="Pune SLAO - Package 4A Desk" subtitle="Official Statutory Dispatch Protocol">
            <div className="flex flex-col h-[400px] justify-between">
              <div className="space-y-4 overflow-y-auto p-2 pr-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-bistre">{m.sender}</span>
                      <span className="text-[9px] text-text-muted">({m.senderRole})</span>
                    </div>
                    <div
                      className={`p-3 rounded-xl max-w-lg text-xs leading-relaxed ${
                        m.isMe
                          ? 'bg-kobicha text-white rounded-tr-none'
                          : 'bg-page text-bistre border border-chamoisee/25 rounded-tl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-text-muted">
                      <span>{m.time}</span>
                      {m.isMe && <CheckCheck className="w-3 h-3 text-kobicha" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="flex items-center gap-2 pt-4 border-t border-chamoisee/15">
                <Button type="button" variant="outline" size="sm" className="p-2">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type an official dispatch memo or query..."
                  className="text-xs py-2"
                />
                <Button type="submit" variant="primary" size="sm" className="gap-1">
                  <Send className="w-4 h-4" /> Send Memo
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyCommunication;
