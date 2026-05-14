import { useState } from 'react';
import styles from './RefundManagement.module.css';

const MOCK_REFUNDS = [
  { id: 'ref_001', userId: 'u001', userName: 'Rahul Verma', amount: 999, plan: 'Standard Care', reason: 'Doctor did not join the video call', date: '2025-05-12', status: 'pending', daysOld: 2 },
  { id: 'ref_002', userId: 'u004', userName: 'Sunita Sharma', amount: 299, plan: 'Rural Basic', reason: 'Technical issue during consultation', date: '2025-05-10', status: 'pending', daysOld: 4 },
  { id: 'ref_003', userId: 'u007', userName: 'Kiran Patel', amount: 2999, plan: 'Multi Care', reason: 'Cancelled within 30 days as per policy', date: '2025-05-08', status: 'approved', daysOld: 6 },
  { id: 'ref_004', userId: 'u009', userName: 'Amit Roy', amount: 1499, plan: 'Premium Care', reason: 'Not satisfied with doctor recommendation', date: '2025-05-05', status: 'rejected', daysOld: 9 },
  { id: 'ref_005', userId: 'u012', userName: 'Divya Singh', amount: 49, plan: 'Rural Basic', reason: 'App crashed during session', date: '2025-05-01', status: 'approved', daysOld: 13 },
];

const STATUS_STYLES = {
  pending: { bg: '#FFF3E0', color: '#E65100' },
  approved: { bg: '#E6F4EA', color: '#34A853' },
  rejected: { bg: '#FEE8E8', color: '#D93025' },
};

export default function RefundManagement() {
  const [refunds, setRefunds] = useState(MOCK_REFUNDS);
  const [filter, setFilter] = useState('all');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  const filtered = filter === 'all' ? refunds : refunds.filter(r => r.status === filter);

  const handleApprove = (id) => {
    setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = (id) => {
    setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setRejectingId(null);
    setRejectReason('');
  };

  const pending = refunds.filter(r => r.status === 'pending');
  const totalPending = pending.reduce((s, r) => s + r.amount, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Refund Management</h1>
          <p className={styles.sub}>{pending.length} pending · ₹{totalPending.toLocaleString()} to process</p>
        </div>
      </div>

      <div className={styles.filters}>
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && <span className={styles.filterCount}>{refunds.filter(r => r.status === f).length}</span>}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map(r => {
          const s = STATUS_STYLES[r.status];
          return (
            <div key={r.id} className={styles.refundCard}>
              <div className={styles.refundLeft}>
                <div className={styles.avatar}>{r.userName.charAt(0)}</div>
                <div>
                  <div className={styles.userName}>{r.userName}</div>
                  <div className={styles.meta}>{r.plan} · Filed {r.daysOld} days ago · {new Date(r.date).toLocaleDateString('en-IN')}</div>
                  <div className={styles.reason}>"{r.reason}"</div>
                </div>
              </div>

              <div className={styles.refundRight}>
                <div className={styles.amount}>₹{r.amount.toLocaleString()}</div>
                <span className={styles.statusBadge} style={{ background: s.bg, color: s.color }}>
                  {r.status}
                </span>
                {r.status === 'pending' && (
                  <div className={styles.actions}>
                    <button className={styles.approveBtn} onClick={() => handleApprove(r.id)}>✓ Approve</button>
                    <button className={styles.rejectBtn} onClick={() => setRejectingId(r.id)}>✕ Reject</button>
                  </div>
                )}
              </div>

              {rejectingId === r.id && (
                <div className={styles.rejectPanel}>
                  <input
                    className={styles.rejectInput}
                    placeholder="Reason for rejection..."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                  />
                  <button className={styles.confirmRejectBtn} onClick={() => handleReject(r.id)} disabled={!rejectReason.trim()}>
                    Confirm Rejection
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setRejectingId(null)}>Cancel</button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <div className={styles.empty}>No {filter} refund requests.</div>}
      </div>
    </div>
  );
}
