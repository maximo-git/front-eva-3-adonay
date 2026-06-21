import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Sede } from '../types';

const VACIO: Omit<Sede, 'id'> = {
  nombre: '',
  ubicacion: '',
  horario: '',
  numeroTelefonico: '',
  imagen: '',
};

interface Errores {
  nombre?: string;
  ubicacion?: string;
  horario?: string;
  numeroTelefonico?: string;
}

export default function Sedes() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  // Inicializamos el estado directamente desde LocalStorage
  const [sedes, setSedes] = useState<Sede[]>(() => {
    const saved = localStorage.getItem('adonay_sedes');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState<Omit<Sede, 'id'>>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Cada vez que la lista de sedes cambie, guardamos en LocalStorage
  useEffect(() => {
    localStorage.setItem('adonay_sedes', JSON.stringify(sedes));
  }, [sedes]);

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imagen: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const validar = (): boolean => {
    const errs: Errores = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    if (!form.ubicacion.trim()) errs.ubicacion = 'La ubicación es obligatoria.';
    if (!form.horario.trim()) errs.horario = 'El horario es obligatorio.';
    if (!form.numeroTelefonico.trim()) {
      errs.numeroTelefonico = 'El teléfono es obligatorio.';
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.numeroTelefonico.trim())) {
      errs.numeroTelefonico = 'Ingresa un número de teléfono válido.';
    }
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const guardar = () => {
    if (!validar()) return;

    if (editId) {
      setSedes((prev) =>
        prev.map((s) => (s.id === editId ? { ...s, ...form } : s))
      );
      setEditId(null);
    } else {
      const nueva: Sede = { id: Date.now().toString(), ...form };
      setSedes((prev) => [...prev, nueva]);
    }

    setForm(VACIO);
    setErrores({});
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const iniciarEdicion = (s: Sede) => {
    setForm({
      nombre: s.nombre,
      ubicacion: s.ubicacion,
      horario: s.horario,
      numeroTelefonico: s.numeroTelefonico,
      imagen: s.imagen,
    });
    setEditId(s.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelar = () => {
    setForm(VACIO);
    setEditId(null);
    setErrores({});
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const eliminar = (id: string) => {
    setSedes((prev) => prev.filter((s) => s.id !== id));
    setConfirmDelete(null);
  };

  const filtradas = sedes.filter(
    (s) =>
      s.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      s.ubicacion.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sedes</h1>
          <p className="page-subtitle">{sedes.length} sede(s) registrada(s)</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(true); setEditId(null); setForm(VACIO); }}
        >
          + Agregar sede
        </button>
      </div>

      {showForm && (
        <div className="form-card animate-fade-in">
          <h2 className="form-card-title">
            {editId ? 'Editar sede' : 'Nueva sede'}
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className={`form-input${errores.nombre ? ' form-input--error' : ''}`}
                placeholder="Ej: Sede Centro"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              {errores.nombre && <p className="form-error">{errores.nombre}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Ubicación *</label>
              <input
                type="text"
                className={`form-input${errores.ubicacion ? ' form-input--error' : ''}`}
                placeholder="Ej: Av. Providencia 1234, Santiago"
                value={form.ubicacion}
                onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              />
              {errores.ubicacion && <p className="form-error">{errores.ubicacion}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Horario *</label>
              <input
                type="text"
                className={`form-input${errores.horario ? ' form-input--error' : ''}`}
                placeholder="Ej: Lun–Vie 12:00–22:00"
                value={form.horario}
                onChange={(e) => setForm({ ...form, horario: e.target.value })}
              />
              {errores.horario && <p className="form-error">{errores.horario}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Número telefónico *</label>
              <input
                type="tel"
                className={`form-input${errores.numeroTelefonico ? ' form-input--error' : ''}`}
                placeholder="Ej: +56 9 1234 5678"
                value={form.numeroTelefonico}
                onChange={(e) => setForm({ ...form, numeroTelefonico: e.target.value })}
              />
              {errores.numeroTelefonico && <p className="form-error">{errores.numeroTelefonico}</p>}
            </div>

            <div className="form-group form-group--full">
              <label className="form-label">Imagen de la sede</label>
              <div className="img-upload-area" onClick={() => fileRef.current?.click()}>
                {form.imagen ? (
                  <img src={form.imagen} alt="preview" className="img-upload-preview" />
                ) : (
                  <div className="img-upload-placeholder">
                    <span className="img-upload-icon">🏢</span>
                    <p>Haz clic para subir una imagen</p>
                    <p className="img-upload-hint">JPG, PNG, WEBP — máx. 2 MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImagen}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-outline" onClick={cancelar}>Cancelar</button>
            <button className="btn btn-primary" onClick={guardar}>
              {editId ? 'Actualizar sede' : 'Guardar sede'}
            </button>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <input
          type="text"
          className="form-input filters-search"
          placeholder="Buscar por nombre o ubicación..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {filtradas.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📍</span>
          <p className="empty-state-text">
            {sedes.length === 0
              ? 'No hay sedes registradas. ¡Agrega la primera!'
              : 'No se encontraron sedes con ese filtro.'}
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtradas.map((s) => (
            <div key={s.id} className="product-card animate-fade-in">
              <div className="product-card-img" onClick={() => navigate(`/sedes/${s.id}`)}>
                {s.imagen ? (
                  <img src={s.imagen} alt={s.nombre} />
                ) : (
                  <div className="product-card-img-placeholder">📍</div>
                )}
              </div>

              <div className="product-card-body">
                <h3 className="product-card-name" onClick={() => navigate(`/sedes/${s.id}`)}>
                  {s.nombre}
                </h3>
                <p className="product-card-desc">
                  <span style={{ marginRight: '4px' }}>📍</span>{s.ubicacion}
                </p>
              </div>

              <div className="product-card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/sedes/${s.id}`)}>
                  Ver detalle
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => iniciarEdicion(s)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(s.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">¿Eliminar sede?</h3>
            <p className="modal-text">Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => eliminar(confirmDelete)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
