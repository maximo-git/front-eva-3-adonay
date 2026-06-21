import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function Layout() {
  const { usuario, loading } = useAuth();

  // Mientras se está leyendo el localStorage, no hacemos nada (evita redirecciones falsas)
  if (loading) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  // Si ya terminó de cargar y no hay usuario, mandamos al login
  if (!usuario) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
