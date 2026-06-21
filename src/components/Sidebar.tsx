import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/resumen', label: 'Resumen', icon: '▦' },
  { to: '/productos', label: 'Productos', icon: '🍣' },
  { to: '/sedes', label: 'Sedes', icon: '📍' },
];

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🍣</span>
        <div>
          <p className="sidebar-logo-title">Adonay Sushi</p>
          <p className="sidebar-logo-sub">Intranet</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Usuario y logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {usuario?.nombre?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{usuario?.nombre || 'Usuario'}</p>
            <p className="sidebar-user-role">{usuario?.rol || 'Rol'}</p>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
