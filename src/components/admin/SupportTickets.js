import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../services/supportService';
import '../../styles/AdminManagement.css';

const SupportTickets = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await supportService.listTickets({ q, status, limit: 50 });
      setItems(res.data?.data?.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-management">
      <div className="management-header">
        <h1>Support Tickets</h1>
        <div className="filters">
          <input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={load}>Apply</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table">
          <div className="table-header">
            <div>Ticket</div>
            <div>Subject</div>
            <div>User</div>
            <div>Status</div>
            <div>Last Activity</div>
          </div>
          {items.map((t) => (
            <div key={t._id} className="table-row">
              <div>{t.ticketId}</div>
              <div>{t.subject}</div>
              <div>{t.user?.email}</div>
              <div><span className="status-badge">{t.status}</span></div>
              <div>{new Date(t.lastActivityAt).toLocaleString()}</div>
            </div>
          ))}
          {items.length === 0 && <div className="empty-state">No tickets found</div>}
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
