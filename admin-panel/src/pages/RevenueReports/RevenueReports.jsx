import { useState } from 'react';
import styles from './RevenueReports.module.css';

const MONTHLY_DATA = [
  { month: 'Dec 2024', revenue: 840000, users: 420, consultations: 340 },
  { month: 'Jan 2025', revenue: 980000, users: 510, consultations: 412 },
  { month: 'Feb 2025', revenue: 1120000, users: 580, consultations: 490 },
  { month: 'Mar 2025', revenue: 1350000, users: 720, consultations: 615 },
  { month: 'Apr 2025', revenue: 1580000, users: 890, consultations: 720 },
  { month: 'May 2025', revenue: 1840000, users: 1024, consultations: 840 },
];

const PLAN_REVENUE = [
  { plan: 'Rural Basic (₹49)', users: 1800, revenue: 88200 },
  { plan: 'Standard Care (₹149)', users: 2400, revenue: 357600 },
  { plan: 'Premium Care (₹299)', users: 1200, revenue: 358800 },
  { plan: 'Multi Care (₹499)', users: 680, revenue: 339320 },
  { plan: 'Annual Plan (₹1499)', users: 200, revenue: 299800 },
];

const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue));

export default function RevenueReports() {
  const [view, setView] = useState('overview');
  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const growth = (((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Revenue Reports</h1>
        <div className={styles.tabs}>
          {['overview', 'plans'].map(t => (
            <button key={t} className={`${styles.tab} ${view === t ? styles.activeTab : ''}`} onClick={() => setView(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>This Month</div>
          <div className={styles.kpiValue}>₹{(currentMonth.revenue / 100000).toFixed(1)}L</div>
          <div className={styles.kpiGrowth}>+{growth}% vs last month</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>New Users</div>
          <div className={styles.kpiValue}>{currentMonth.users.toLocaleString()}</div>
          <div className={styles.kpiGrowth}>This month</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Consultations</div>
          <div className={styles.kpiValue}>{currentMonth.consultations.toLocaleString()}</div>
          <div className={styles.kpiGrowth}>This month</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Avg Revenue/User</div>
          <div className={styles.kpiValue}>₹{Math.round(currentMonth.revenue / currentMonth.users)}</div>
          <div className={styles.kpiGrowth}>This month</div>
        </div>
      </div>

      {view === 'overview' && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Monthly Revenue Trend</h3>
          <div className={styles.chart}>
            {MONTHLY_DATA.map(d => (
              <div key={d.month} className={styles.bar}>
                <div className={styles.barValue}>₹{(d.revenue / 100000).toFixed(1)}L</div>
                <div
                  className={styles.barFill}
                  style={{ height: `${(d.revenue / maxRevenue) * 200}px` }}
                ></div>
                <div className={styles.barLabel}>{d.month.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'plans' && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Revenue by Plan</h3>
          <table className={styles.planTable}>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Active Users</th>
                <th>Monthly Revenue</th>
                <th>% of Total</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {PLAN_REVENUE.map(p => {
                const totalPlanRevenue = PLAN_REVENUE.reduce((s, x) => s + x.revenue, 0);
                const pct = ((p.revenue / totalPlanRevenue) * 100).toFixed(1);
                return (
                  <tr key={p.plan} className={styles.planRow}>
                    <td className={styles.planName}>{p.plan}</td>
                    <td>{p.users.toLocaleString()}</td>
                    <td className={styles.revenue}>₹{(p.revenue / 100000).toFixed(2)}L</td>
                    <td>
                      <div className={styles.pctBar}>
                        <div className={styles.pctFill} style={{ width: `${pct}%` }}></div>
                        <span>{pct}%</span>
                      </div>
                    </td>
                    <td className={styles.trend}>↑ +{(Math.random() * 20 + 5).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
