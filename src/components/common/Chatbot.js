import React, { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../../services/chatbotService';
import '../../styles/Chatbot.css';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'welcome', sender: 'bot', text: 'Hi! I can help with orders, payments, and refunds. How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg = { id: Date.now() + '-u', sender: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await chatbotService.sendMessage(text);
      const data = res.data?.data;
      const reply = data?.reply || "I'm here to help.";
      const botMsg = { id: Date.now() + '-b', sender: 'bot', text: reply };
      setMessages((m) => [...m, botMsg]);
      if (data?.ticketId) setTicketId(data.ticketId);
    } catch (err) {
      setMessages((m) => [...m, { id: Date.now() + '-e', sender: 'bot', text: 'Oops, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle chatbot">
        {open ? '×' : 'Chat'}
      </button>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">Support Chat</div>
          <div ref={listRef} className="chatbot-messages">
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.sender}`}>{m.text}</div>
            ))}
            {ticketId && (
              <div className="ticket-banner">
                Support ticket created: <strong>{ticketId}</strong>
              </div>
            )}
          </div>
          <div className="chatbot-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              rows={2}
            />
            <button className="send-btn" onClick={send} disabled={loading}>{loading ? '...' : 'Send'}</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
