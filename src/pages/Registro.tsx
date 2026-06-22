import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Empleado } from '../types';

interface RegistroForm {
  nombre: string;
  apellido: string;
  rut: string;
  fechaNacimiento: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errores {
  nombre?: string;
  apellido?: string;
  rut?: string;
  fechaNacimiento?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Registro() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // Si ya hay sesión activa, redirigir al resumen
  if (usuario) return <Navigate to="/resumen" replace />;

  const [form, setForm] = useState<RegistroForm>({
    nombre: '',
    apellido: '',
    rut: '',
    fechaNacimiento: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errores, setErrores] = useState<Errores>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ─── Validar RUT (formato: 12.345.678-9) ───
  const validarRUT = (rut: string): boolean => {
    const regex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
    return regex.test(rut);
  };

  // ─── Validar email ───
  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ─── Validar contraseña (mínimo 6 caracteres) ───
  const validarPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // ─── Validar formulario ───
  const validar = (): boolean => {
    const errs: Errores = {};

    if (!form.nombre.trim()) {
      errs.nombre = 'El nombre es obligatorio.';
    }

    if (!form.apellido.trim()) {
      errs.apellido = 'El apellido es obligatorio.';
    }

    if (!form.rut.trim()) {
      errs.rut = 'El RUT es obligatorio.';
    } else if (!validarRUT(form.rut)) {
      errs.rut = 'Formato: 12.345.678-9';
    }

    if (!form.fechaNacimiento) {
      errs.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    }

    if (!form.email.trim()) {
      errs.email = 'El email es obligatorio.';
    } else if (!validarEmail(form.email)) {
      errs.email = 'Email inválido.';
    } else {
      // Verificar que el email no exista en empleados
      const empleados = JSON.parse(localStorage.getItem('adonay_empleados') || '[]');
      if (empleados.some((e: Empleado) => e.email === form.email)) {
        errs.email = 'Este email ya está registrado.';
      }
    }

    if (!form.password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (!validarPassword(form.password)) {
      errs.password = 'Mínimo 6 caracteres.';
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Confirma la contraseña.';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Registrar empleado ───
  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    setErrores({});

    if (!validar()) return;

    setLoading(true);

    setTimeout(() => {
      try {
        // Obtener empleados existentes
        const empleados: Empleado[] = JSON.parse(
          localStorage.getItem('adonay_empleados') || '[]'
        );

        // Crear nuevo empleado
        const nuevoEmpleado: Empleado = {
          id: Date.now().toString(),
          nombre: form.nombre,
          apellido: form.apellido,
          rut: form.rut,
          email: form.email,
          telefono: '', // Se puede agregar después
          password: form.password, 
          rol: 'empleado', // Por defecto, rol empleado
          cargo: 'empleado',
          fechaIngreso: new Date().toISOString().split('T')[0],
          activo: true,
        };

        // Guardar en localStorage
        empleados.push(nuevoEmpleado);
        localStorage.setItem('adonay_empleados', JSON.stringify(empleados));

        setSuccess(true);

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        console.error('Error al registrar:', error);
        setErrores({ email: 'Error al registrar. Intenta de nuevo.' });
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Encabezado */}
        <div className="login-header">
          <img 
         src="/logo_sushi.jpeg" 
         alt="Adonay Sushi" 
         style={{ 
         width: '90px', 
         height: '90px', 
         borderRadius: '30px',
         display: 'block',
         margin: '0 auto'
          }}
        />
          <h1 className="login-title">Adonay Sushi</h1>
          <p className="login-subtitle">Registro de Empleado</p>
        </div>

        {success ? (
          <div className="form-success-banner">
            ✅ ¡Registro exitoso! Redirigiendo al login...
          </div>
        ) : (
          <form onSubmit={handleRegistro} noValidate>
            {/* Nombre */}
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-input"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              {errores.nombre && (
                <p className="form-error">{errores.nombre}</p>
              )}
            </div>

            {/* Apellido */}
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                className="form-input"
                placeholder="Tu apellido"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              />
              {errores.apellido && (
                <p className="form-error">{errores.apellido}</p>
              )}
            </div>

            {/* RUT */}
            <div className="form-group">
              <label className="form-label">RUT (12.345.678-9)</label>
              <input
                type="text"
                className="form-input"
                placeholder="12.345.678-9"
                value={form.rut}
                onChange={(e) => setForm({ ...form, rut: e.target.value })}
              />
              {errores.rut && (
                <p className="form-error">{errores.rut}</p>
              )}
            </div>

            {/* Fecha de Nacimiento */}
            <div className="form-group">
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-input"
                value={form.fechaNacimiento}
                onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
              />
              {errores.fechaNacimiento && (
                <p className="form-error">{errores.fechaNacimiento}</p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errores.email && (
                <p className="form-error">{errores.email}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errores.password && (
                <p className="form-error">{errores.password}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                className="form-input"
                placeholder="Confirma tu contraseña"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
              {errores.confirmPassword && (
                <p className="form-error">{errores.confirmPassword}</p>
              )}
            </div>

            {/* Botón Registrar */}
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            {/* Link al login */}
            <p className="form-footer">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="form-link"
              >
                Inicia sesión aquí
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
