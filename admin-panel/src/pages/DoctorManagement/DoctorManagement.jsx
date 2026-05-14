import { useState } from 'react';
import styles from './DoctorManagement.module.css';

const MOCK_DOCTORS = [
  { id: 'd001', name: 'Dr. Priya Sharma', specialization: 'Dermatology & Hair', experience: 8, rating: 4.8, consultations: 1240, status: 'active', verified: true, payoutPending: 12400, joined: '2024-06-15' },
  { id: 'd002', name: 'Dr. Arjun Mehta', specialization: 'General Medicine', experience: 12, rating: 4.6, consultations: 2100, status: 'active', verified: true, payoutPending: 21000, joined: '2024-05-01' },
  { id: 'd003', name: 'Dr. Neha Gupta', specialization: 'Dermatology', experience: 5, rating: null, consultations: 0, status: 'pending', verified: false, payoutPending: 0, joined: '2025-05-14' },
  { id: 'd004', name: 'Dr. Suresh Nair', specialization: 'Endocrinology', experience: 15, rating: 4.9, consultations: 3200, status: 'active', verified: true, payoutPending: 32000, joined: '2024-01-10' },
  { id: 'd005', name: 'Dr. Kavita Reddy', specialization: 'Psychiatry & Wellness', experience: 9, rating: 4.7, consultations: 890, status: 'suspended', verified: true, payoutPending: 0, joined: '2024-08-22' },
];

export default function DoctorManagement() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_DOCTORS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAction = (doctorId, action) => {
    alert(`Action: ${action} for doctor ${doctorId}\n(Connect to backend API)`);
  };

  const totalPayout = MOCK_DOCTORS.reduce((s, d) => s + d.payoutPending, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Doctor Management</h1>
          <p className={styles.sub}>{MOCK_DOCTORS.filter(d => d.status === 'pending').length} pending verifications</p>
        </div>
        <div className={styles.payoutBanner}>
          💰 Total Pending Payout: <strong>₹{totalPayout.toLocaleString()}</strong>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles.filters}>
          {['all', 'active', 'pending', 'suspended'].map(f => (
            <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Rating</th>
              <th>Consultations</th>
              <th>Payout Pending</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className={styles.row}>
                <td>
                  <div className={styles.doctorCell}>
                    <div className={styles.avatar}>{d.name.charAt(3)}</div>
                    <div>
                      <div className={styles.doctorName}>{d.name}</div>
                      {d.verified && <span className={styles.verifiedBadge}>✓ Verified</span>}
                    </div>
                  </div>
                </td>
                <td className={styles.spec}>{d.specialization}</td>
                <td>{d.experience} yrs</td>
                <td>{d.rating ? `⭐ ${d.rating}` : '—'}</td>
                <td className={styles.center}>{d.consultations.toLocaleString()}</td>
                <td className={d.payoutPending > 0 ? styles.payoutAmount : styles.noPayout}>
                  {d.payoutPending > 0 ? `₹${d.payoutPending.toLocaleString()}` : '—'}
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles['status_' + d.status]}`}>{d.status}</span>
                </td>
                <td>
                  <div className={styles.actions}>
                    {d.status === 'pending' && (
                      <button className={styles.approveBtn} onClick={() => handleAction(d.id, 'approve')}>Verify</button>
                    )}
                    {d.status === 'active' && (
                      <button className={styles.suspendBtn} onClick={() => handleAction(d.id, 'suspend')}>Suspend</button>
                    )}
                    {d.status === 'suspended' && (
                      <button className={styles.approveBtn} onClick={() => handleAction(d.id, 'activate')}>Reinstate</button>
                    )}
                    {d.payoutPending > 0 && (
                      <button className={styles.payoutBtn} onClick={() => handleAction(d.id, 'payout')}>Pay</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className={styles.empty}>No doctors found.</div>}
      </div>
    </div>
  );
}
