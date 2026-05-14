import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AppointmentList.module.css';

const MOCK_APPOINTMENTS = [
  {
    id: 'appt_001',
    patientId: 'pat_001',
    patientName: 'Rahul Verma',
    age: 28,
    concern: 'Hair Loss',
    date: new Date().toISOString(),
    time: '10:00 AM',
    status: 'upcoming',
    type: 'video',
    plan: 'Standard Care',
  },
  {
    id: 'appt_002',
    patientId: 'pat_002',
    patientName: 'Priya Patel',
    age: 34,
    concern: 'Acne & Skin',
    date: new Date().toISOString(),
    time: '11:30 AM',
    status: 'upcoming',
    type: 'video',
    plan: 'Premium Care',
  },
  {
    id: 'appt_003',
    patientId: 'pat_003',
    patientName: 'Amit Singh',
    age: 42,
    concern: 'Diabetes Management',
    date: new Date().toISOString(),
    time: '2:00 PM',
    status: 'completed',
    type: 'video',
    plan: 'Annual Plan',
  },
  {
    id: 'appt_004',
    patientId: 'pat_004',
    patientName: 'Sunita Sharma',
    age: 31,
    concern: 'Stress & Mental Wellness',
    date: new Date().toISOString(),
    time: '3:30 PM',
    status: 'cancelled',
    type: 'video',
    plan: 'Standard Care',
  },
];

const STATUS_COLORS = {
  upcoming: { bg: '#E8F0FE', text: '#1A73E8', label: 'Upcoming' },
  completed: { bg: '#E6F4EA', text: '#34A853', label: 'Completed' },
  cancelled: { bg: '#FEE8E8', text: '#D93025', label: 'Cancelled' },
};

export default function AppointmentList() {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const filtered = filter === 'all' ? MOCK_APPOINTMENTS : MOCK_APPOINTMENTS.filter(a => a.status === filter);

  const upcoming = MOCK_APPOINTMENTS.filter(a => a.status === 'upcoming').length;
  const completed = MOCK_APPOINTMENTS.filter(a => a.status === 'completed').length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Today's Appointments</h1>
          <p className={styles.date}>{today}</p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{upcoming}</div>
          <div className={styles.statLabel}>Upcoming</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{completed}</div>
          <div className={styles.statLabel}>Completed Today</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{MOCK_APPOINTMENTS.length}</div>
          <div className={styles.statLabel}>Total Today</div>
        </div>
      </div>

      <div className={styles.filters}>
        {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map(appt => {
          const statusStyle = STATUS_COLORS[appt.status];
          return (
            <div key={appt.id} className={styles.apptCard}>
              <div className={styles.apptLeft}>
                <div className={styles.patientAvatar}>{appt.patientName.charAt(0)}</div>
                <div className={styles.apptInfo}>
                  <div className={styles.patientName}>{appt.patientName}</div>
                  <div className={styles.apptMeta}>Age {appt.age} · {appt.concern} · {appt.plan}</div>
                </div>
              </div>

              <div className={styles.apptMiddle}>
                <div className={styles.time}>🕐 {appt.time}</div>
                <div className={styles.type}>📹 {appt.type} consultation</div>
              </div>

              <div className={styles.apptRight}>
                <span className={styles.badge} style={{ background: statusStyle.bg, color: statusStyle.text }}>
                  {statusStyle.label}
                </span>
                {appt.status === 'upcoming' && (
                  <div className={styles.actions}>
                    <button className={styles.btnPrimary} onClick={() => navigate(`/consult/${appt.id}`)}>
                      Start Call
                    </button>
                    <button className={styles.btnOutline} onClick={() => navigate(`/patient/${appt.patientId}`)}>
                      History
                    </button>
                  </div>
                )}
                {appt.status === 'completed' && (
                  <button className={styles.btnOutline} onClick={() => navigate(`/prescription/${appt.id}`)}>
                    View Rx
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className={styles.empty}>No {filter} appointments today.</div>
        )}
      </div>
    </div>
  );
}
