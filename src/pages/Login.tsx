import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, usuario } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión activa, redirigir al resumen
  if (usuario) return <Navigate to="/resumen" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('El correo es obligatorio.'); return; }
    if (!password.trim()) { setError('La contraseña es obligatoria.'); return; }

    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim(), password);
      if (ok) {
        navigate('/resumen');
      } else {
        setError('Correo o contraseña incorrectos.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Encabezado */}
        <div className="login-header">
          <span className="login-logo">🍣</span>
          <h1 className="login-title">Adonay Sushi</h1>
          <p className="login-subtitle">Acceso a la Intranet</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-input"
              placeholder="correo@adonay.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="form-error-banner">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
         {/* Link a registro */}
        <p className="form-footer">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/registro')}
            className="form-link"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}
