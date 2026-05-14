import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import styles from './Layout.module.css';

const NAV_ITEMS = [
  { path: '/appointments', label: 'Appointments', icon: '📅' },
  { path: '/patient', label: 'Patients', icon: '👥' },
];

export default function Layout() {
  const { doctor, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🏥</span>
          <div>
            <div className={styles.logoTitle}>HealthAI India</div>
            <div className={styles.logoSub}>Doctor Panel</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.doctorCard}>
          <div className={styles.avatar}>{doctor?.name?.[3] ?? 'D'}</div>
          <div className={styles.doctorInfo}>
            <div className={styles.doctorName}>{doctor?.name}</div>
            <div className={styles.doctorSpec}>{doctor?.specialization}</div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">⏻</button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
