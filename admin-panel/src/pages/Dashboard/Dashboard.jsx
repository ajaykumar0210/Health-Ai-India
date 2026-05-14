import styles from './Dashboard.module.css';

const STATS = [
  { label: 'Total Users', value: '12,480', change: '+340 this week', icon: '👥', color: '#1A73E8' },
  { label: 'Active Doctors', value: '248', change: '+12 pending verification', icon: '👨‍⚕️', color: '#34A853' },
  { label: 'Monthly Revenue', value: '₹18.4L', change: '+22% vs last month', icon: '💰', color: '#FF6D00' },
  { label: 'Consultations Today', value: '1,024', change: '+8% vs yesterday', icon: '📅', color: '#9C27B0' },
];

const RECENT_ACTIVITY = [
  { time: '2 min ago', event: 'New doctor registration: Dr. Neha Gupta (Dermatology)', type: 'info' },
  { time: '15 min ago', event: 'Refund approved: ₹999 for user Rahul V.', type: 'success' },
  { time: '1 hour ago', event: 'Subscription cancelled: Premium Care (user ID 8821)', type: 'warning' },
  { time: '2 hours ago', event: 'New user milestone: 12,000+ registered users', type: 'success' },
  { time: '3 hours ago', event: 'Complaint filed: Video call issue - appointment #4521', type: 'error' },
];

const PLAN_BREAKDOWN = [
  { plan: 'Freemium', users: 6200, revenue: 0, color: '#9AA0A6' },
  { plan: 'Rural Basic', users: 1800, revenue: 89910, color: '#34A853' },
  { plan: 'Standard Care', users: 2400, revenue: 359760, color: '#1A73E8' },
  { plan: 'Premium Care', users: 1200, revenue: 359760, color: '#FF6D00' },
  { plan: 'Multi Care', users: 680, revenue: 339320, color: '#9C27B0' },
  { plan: 'Annual Plan', users: 200, revenue: 299600, color: '#F9AB00' },
];

const ACTIVITY_COLORS = { info: '#1A73E8', success: '#34A853', warning: '#F9AB00', error: '#D93025' };

export default function Dashboard() {
  const totalRevenue = PLAN_BREAKDOWN.reduce((s, p) => s + p.revenue, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <p className={styles.date}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className={styles.statsGrid}>
        {STATS.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
            <div>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statChange}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Plan-wise Breakdown</h3>
          <div className={styles.planList}>
            {PLAN_BREAKDOWN.map(p => (
              <div key={p.plan} className={styles.planRow}>
                <div className={styles.planName}>
                  <span className={styles.planDot} style={{ background: p.color }}></span>
                  {p.plan}
                </div>
                <div className={styles.planStats}>
                  <span>{p.users.toLocaleString()} users</span>
                  <span className={styles.planRevenue}>₹{(p.revenue / 100000).toFixed(1)}L</span>
                </div>
                <div className={styles.planBar}>
                  <div
                    className={styles.planBarFill}
                    style={{ width: `${(p.users / 6200) * 100}%`, background: p.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.totalRevenue}>
            Total Monthly Revenue: <strong>₹{(totalRevenue / 100000).toFixed(1)}L</strong>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className={styles.activityItem}>
                <div
                  className={styles.activityDot}
                  style={{ background: ACTIVITY_COLORS[a.type] }}
                ></div>
                <div className={styles.activityContent}>
                  <div className={styles.activityEvent}>{a.event}</div>
                  <div className={styles.activityTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
