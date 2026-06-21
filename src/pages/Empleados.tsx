import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Empleado } from '../types';

const ROLES = ['admin', 'empleado'];

const VACIO: Omit<Empleado, 'id'> = {
  nombre: '',
  apellido: '',
  rut: '',
  email: '',
  telefono: '',
  password: '', 
  rol: 'empleado',
  cargo: 'empleado',
  fechaIngreso: new Date().toISOString().split('T')[0],
  activo: true,
};

interface Errores {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  password?: string;
  rol?: string;
}

export default function Empleados() {
  const navigate = useNavigate();
   const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';
  

  const [empleados, setEmpleados] = useState<Empleado[]>(() => {
    const saved = localStorage.getItem('adonay_empleados');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState<Omit<Empleado, 'id'>>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('adonay_empleados', JSON.stringify(empleados));
  }, [empleados]);

  const isEmailValid = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isPhoneValid = (phone: string): boolean => {
    const regex = /^[\d\s\-\+\(\)]{7,}$/;
    return regex.test(phone);
  };

  const validar = (): boolean => {
    const errs: Errores = {};
    
    if (!form.nombre.trim()) {
      errs.nombre = 'El nombre es obligatorio.';
    }
    
    if (!form.apellido.trim()) {
      errs.apellido = 'El apellido es obligatorio.';
    }
    
    if (!form.email.trim()) {
      errs.email = 'El email es obligatorio.';
    } else if (!isEmailValid(form.email)) {
      errs.email = 'Ingresa un email válido.';
    } else {
      const emailExiste = empleados.some(
        (e) => e.email === form.email && e.id !== editId
      );
      if (emailExiste) {
        errs.email = 'Ya existe un empleado con este email.';
      }
      if (!form.password.trim()) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (form.password.length < 6) {
      errs.password = 'Mínimo 6 caracteres.';
    }
    }
    
    if (!form.telefono.trim()) {
      errs.telefono = 'El teléfono es obligatorio.';
    } else if (!isPhoneValid(form.telefono)) {
      errs.telefono = 'Ingresa un teléfono válido.';
    }
    
    if (!form.rol) {
      errs.rol = 'Selecciona un rol.';
    }
    
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const guardar = () => {
    if (!validar()) return;

    if (editId) {
      setEmpleados((prev) =>
        prev.map((e) => (e.id === editId ? { ...e, ...form } : e))
      );
      setEditId(null);
    } else {
      const nuevo: Empleado = { id: Date.now().toString(), ...form };
      setEmpleados((prev) => [...prev, nuevo]);
    }

    setForm(VACIO);
    setErrores({});
    setShowForm(false);
  };
const iniciarEdicion = (e: Empleado) => {
    setForm({
      nombre: e.nombre,
      apellido: e.apellido,
      rut: e.rut,
      email: e.email,
      password: e.password,       // ← AGREGUÉ ESTO
      telefono: e.telefono,
      rol: e.rol,
      cargo: e.cargo,
      fechaIngreso: e.fechaIngreso,
      activo: e.activo,
    });
    setEditId(e.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelar = () => {
    setForm(VACIO);
    setEditId(null);
    setErrores({});
    setShowForm(false);
  };

  const eliminar = (id: string) => {
    setEmpleados((prev) => prev.filter((e) => e.id !== id));
    setConfirmDelete(null);
  };

  const filtrados = empleados.filter((e) => {
    const matchTexto =
      e.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      e.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
      e.email.toLowerCase().includes(filtro.toLowerCase());
    return matchTexto;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Empleados</h1>
          <p className="page-subtitle">{empleados.length} empleado(s) registrado(s)</p>
        </div>
        {esAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm(VACIO);
            }}
          >
            + Agregar empleado
          </button>
        )}
      </div>

      {esAdmin && showForm && (
        <div className="form-card animate-fade-in">
          <h2 className="form-card-title">
            {editId ? 'Editar empleado' : 'Nuevo empleado'}
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className={`form-input${errores.nombre ? ' form-input--error' : ''}`}
                placeholder="Ej: Juan"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              {errores.nombre && <p className="form-error">{errores.nombre}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Apellido *</label>
              <input
                type="text"
                className={`form-input${errores.apellido ? ' form-input--error' : ''}`}
                placeholder="Ej: Pérez"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              />
              {errores.apellido && <p className="form-error">{errores.apellido}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className={`form-input${errores.email ? ' form-input--error' : ''}`}
                placeholder="Ej: juan@adonay.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errores.email && <p className="form-error">{errores.email}</p>}
            </div>

  <div className="form-group">
              <label className="form-label">Contraseña *</label>
              <input
                type="password"
                className={`form-input${errores.password ? ' form-input--error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errores.password && <p className="form-error">{errores.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input
                type="tel"
                className={`form-input${errores.telefono ? ' form-input--error' : ''}`}
                placeholder="Ej: +56 9 1234 5678"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
              {errores.telefono && <p className="form-error">{errores.telefono}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Rol *</label>
              <select
                className={`form-input form-select${errores.rol ? ' form-input--error' : ''}`}
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value as 'admin' | 'empleado' })}
              >
                <option value="">Seleccionar rol...</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r === 'admin' ? 'Administrador' : 'Empleado'}
                  </option>
                ))}
              </select>
              {errores.rol && <p className="form-error">{errores.rol}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de ingreso</label>
              <input
                type="date"
                className="form-input"
                value={form.fechaIngreso}
                onChange={(e) => setForm({ ...form, fechaIngreso: e.target.value })}
              />
            </div>

            <div className="form-group">
                <label className="form-label">RUT *</label>
               <input
                 type="text"
                 className="form-input"
                 placeholder="Ej: 12.345.678-9"
                 value={form.rut}
                 onChange={(e) => setForm({ ...form, rut: e.target.value })}
               />
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className="form-input form-select"
                value={form.activo ? 'activo' : 'inactivo'}
                onChange={(e) => setForm({ ...form, activo: e.target.value === 'activo' })}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-outline" onClick={cancelar}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={guardar} disabled={!esAdmin}>
              {editId ? 'Actualizar empleado' : 'Guardar empleado'}
            </button>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <input
          type="text"
          className="form-input filters-search"
          placeholder="Buscar por nombre, apellido o email..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {filtrados.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">👥</span>
          <p className="empty-state-text">
            {empleados.length === 0
              ? 'No hay empleados registrados. ¡Agrega el primero!'
              : 'No se encontraron empleados con ese filtro.'}
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtrados.map((e) => (
            <div key={e.id} className="product-card animate-fade-in">
              <div className="product-card-img">
                <div className="product-card-img-placeholder" style={{ fontSize: '2rem' }}>
                  {e.nombre[0]}
                  {e.apellido[0]}
                </div>
                <span className="product-card-badge">
                  {e.rol === 'admin' ? 'Administrador' : 'Empleado'}
                </span>
              </div>

              <div className="product-card-body">
                <h3 className="product-card-name" onClick={() => navigate(`/empleados/${e.id}`)}>
                  {e.nombre} {e.apellido}
                </h3>
                <p className="product-card-price">{e.email}</p>
                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                  {e.activo ? '✓ Activo' : '✗ Inactivo'}
                </p>
              </div>

              <div className="product-card-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate(`/empleados/${e.id}`)}
                >
                  Ver detalle
                </button>
                {esAdmin && (
                  <>
                    <button className="btn btn-outline btn-sm" onClick={() => iniciarEdicion(e)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(e.id)}>
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">¿Eliminar empleado?</h3>
            <p className="modal-text">Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => eliminar(confirmDelete)}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}