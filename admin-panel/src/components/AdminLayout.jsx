import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../store/useAdminAuth';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/users', label: 'User Management', icon: '👥' },
  { path: '/doctors', label: 'Doctor Management', icon: '👨‍⚕️' },
  { path: '/revenue', label: 'Revenue Reports', icon: '💰' },
  { path: '/refunds', label: 'Refund Management', icon: '↩️' },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span>🏥</span>
          <div>
            <div className={styles.logoTitle}>HealthAI India</div>
            <div className={styles.logoSub}>Admin Panel</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.adminInfo}>
          <div className={styles.adminAvatar}>{admin?.name?.charAt(0) ?? 'A'}</div>
          <div>
            <div className={styles.adminName}>{admin?.name}</div>
            <div className={styles.adminRole}>{admin?.role}</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </aside>
      <main className={styles.main}><Outlet /></main>
    </div>
  );
}
