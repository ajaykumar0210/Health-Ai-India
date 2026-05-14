import { useState } from 'react';
import styles from './UserManagement.module.css';

const MOCK_USERS = [
  { id: 'u001', name: 'Rahul Verma', phone: '+91 98765 43210', plan: 'Standard Care', status: 'active', joined: '2025-03-15', consultations: 5, concerns: ['Hair Loss'] },
  { id: 'u002', name: 'Priya Patel', phone: '+91 87654 32109', plan: 'Premium Care', status: 'active', joined: '2025-02-20', consultations: 8, concerns: ['Skin', 'Stress'] },
  { id: 'u003', name: 'Amit Singh', phone: '+91 76543 21098', plan: 'Annual Plan', status: 'active', joined: '2024-12-10', consultations: 18, concerns: ['Diabetes'] },
  { id: 'u004', name: 'Sunita Sharma', phone: '+91 65432 10987', plan: 'Freemium', status: 'inactive', joined: '2025-04-01', consultations: 1, concerns: ['Weight'] },
  { id: 'u005', name: 'Vikram Kumar', phone: '+91 54321 09876', plan: 'Rural Basic', status: 'active', joined: '2025-01-08', consultations: 3, concerns: ['Hair Loss', 'Skin'] },
  { id: 'u006', name: 'Meera Nair', phone: '+91 43210 98765', plan: 'Standard Care', status: 'suspended', joined: '2025-03-22', consultations: 2, concerns: ['Sexual Health'] },
];

const PLAN_COLORS = {
  'Freemium': '#9AA0A6',
  'Rural Basic': '#34A853',
  'Standard Care': '#1A73E8',
  'Premium Care': '#FF6D00',
  'Annual Plan': '#9C27B0',
};

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = MOCK_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.phone.includes(search);
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = (userId, action) => {
    alert(`Action: ${action} for user ${userId}\n(Connect to backend API)`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
        <div className={styles.stats}>
          <span>Total: {MOCK_USERS.length}</span>
          <span>Active: {MOCK_USERS.filter(u => u.status === 'active').length}</span>
          <span>Suspended: {MOCK_USERS.filter(u => u.status === 'suspended').length}</span>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.filters}>
          {['all', 'active', 'inactive', 'suspended'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${statusFilter === f ? styles.activeFilter : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Plan</th>
              <th>Consultations</th>
              <th>Concerns</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className={styles.row}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.userAvatar}>{u.name.charAt(0)}</div>
                    {u.name}
                  </div>
                </td>
                <td className={styles.phone}>{u.phone}</td>
                <td>
                  <span className={styles.planBadge} style={{ background: (PLAN_COLORS[u.plan] || '#9AA0A6') + '20', color: PLAN_COLORS[u.plan] || '#9AA0A6' }}>
                    {u.plan}
                  </span>
                </td>
                <td className={styles.center}>{u.consultations}</td>
                <td>
                  <div className={styles.tags}>
                    {u.concerns.map(c => <span key={c} className={styles.tag}>{c}</span>)}
                  </div>
                </td>
                <td>{new Date(u.joined).toLocaleDateString('en-IN')}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles['status_' + u.status]}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.viewBtn} onClick={() => setSelectedUser(u)}>View</button>
                    {u.status === 'active' && (
                      <button className={styles.suspendBtn} onClick={() => handleAction(u.id, 'suspend')}>Suspend</button>
                    )}
                    {u.status === 'suspended' && (
                      <button className={styles.activateBtn} onClick={() => handleAction(u.id, 'activate')}>Activate</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className={styles.empty}>No users found.</div>}
      </div>

      {selectedUser && (
        <div className={styles.modal} onClick={() => setSelectedUser(null)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>User Details</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedUser(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}><span>Name</span><strong>{selectedUser.name}</strong></div>
              <div className={styles.detailRow}><span>Phone</span><strong>{selectedUser.phone}</strong></div>
              <div className={styles.detailRow}><span>Plan</span><strong>{selectedUser.plan}</strong></div>
              <div className={styles.detailRow}><span>Consultations</span><strong>{selectedUser.consultations}</strong></div>
              <div className={styles.detailRow}><span>Status</span><strong>{selectedUser.status}</strong></div>
              <div className={styles.detailRow}><span>Joined</span><strong>{new Date(selectedUser.joined).toLocaleDateString('en-IN')}</strong></div>
              <div className={styles.detailRow}><span>Concerns</span><strong>{selectedUser.concerns.join(', ')}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
