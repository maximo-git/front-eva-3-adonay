import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Producto } from '../types';

const CATEGORIAS = ['Rolls', 'Nigiri', 'Sashimi', 'Temaki', 'Entradas', 'Bebidas', 'Postres', 'Otro'];

const VACIO: Omit<Producto, 'id'> = {
  nombre: '',
  precio: 0,
  descripcion: '',
  imagen: '',
  categoria: '',
};

interface Errores {
  nombre?: string;
  precio?: string;
  categoria?: string;
}

export default function Productos() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  // Inicializamos el estado directamente desde LocalStorage para evitar parpadeos o pérdidas
  const [productos, setProductos] = useState<Producto[]>(() => {
    const saved = localStorage.getItem('adonay_productos');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState<Omit<Producto, 'id'>>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [filtroCat, setFiltroCat] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Cada vez que la lista de productos cambie, guardamos en LocalStorage
  useEffect(() => {
    localStorage.setItem('adonay_productos', JSON.stringify(productos));
  }, [productos]);

  // Manejo de imagen
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
    if (!form.precio || form.precio <= 0) errs.precio = 'Ingresa un precio válido mayor a 0.';
    if (!form.categoria) errs.categoria = 'Selecciona una categoría.';
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const guardar = () => {
    if (!validar()) return;

    if (editId) {
      setProductos((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...form } : p))
      );
      setEditId(null);
    } else {
      const nuevo: Producto = { id: Date.now().toString(), ...form };
      setProductos((prev) => [...prev, nuevo]);
    }

    setForm(VACIO);
    setErrores({});
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const iniciarEdicion = (p: Producto) => {
    setForm({ nombre: p.nombre, precio: p.precio, descripcion: p.descripcion, imagen: p.imagen, categoria: p.categoria });
    setEditId(p.id);
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
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setConfirmDelete(null);
  };

  const filtrados = productos.filter((p) => {
    const matchTexto = p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(filtro.toLowerCase());
    const matchCat = filtroCat ? p.categoria === filtroCat : true;
    return matchTexto && matchCat;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">{productos.length} producto(s) registrado(s)</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(true); setEditId(null); setForm(VACIO); }}
        >
          + Agregar producto
        </button>
      </div>

      {showForm && (
        <div className="form-card animate-fade-in">
          <h2 className="form-card-title">
            {editId ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className={`form-input${errores.nombre ? ' form-input--error' : ''}`}
                placeholder="Ej: Roll Salmón"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              {errores.nombre && <p className="form-error">{errores.nombre}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Precio (CLP) *</label>
              <input
                type="number"
                className={`form-input${errores.precio ? ' form-input--error' : ''}`}
                placeholder="Ej: 8900"
                value={form.precio || ''}
                onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                min={0}
              />
              {errores.precio && <p className="form-error">{errores.precio}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select
                className={`form-input form-select${errores.categoria ? ' form-input--error' : ''}`}
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              >
                <option value="">Seleccionar categoría...</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errores.categoria && <p className="form-error">{errores.categoria}</p>}
            </div>

            <div className="form-group form-group--full">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Descripción del producto..."
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-group form-group--full">
              <label className="form-label">Imagen del producto</label>
              <div className="img-upload-area" onClick={() => fileRef.current?.click()}>
                {form.imagen ? (
                  <img src={form.imagen} alt="preview" className="img-upload-preview" />
                ) : (
                  <div className="img-upload-placeholder">
                    <span className="img-upload-icon">📷</span>
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
              {editId ? 'Actualizar producto' : 'Guardar producto'}
            </button>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <input
          type="text"
          className="form-input filters-search"
          placeholder="Buscar por nombre o descripción..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <select
          className="form-input form-select filters-select"
          value={filtroCat}
          onChange={(e) => setFiltroCat(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtrados.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🍣</span>
          <p className="empty-state-text">
            {productos.length === 0
              ? 'No hay productos registrados. ¡Agrega el primero!'
              : 'No se encontraron productos con ese filtro.'}
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtrados.map((p) => (
            <div key={p.id} className="product-card animate-fade-in">
              <div className="product-card-img" onClick={() => navigate(`/productos/${p.id}`)}>
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} />
                ) : (
                  <div className="product-card-img-placeholder">🍣</div>
                )}
                <span className="product-card-badge">{p.categoria}</span>
              </div>

              <div className="product-card-body">
                <h3 className="product-card-name" onClick={() => navigate(`/productos/${p.id}`)}>
                  {p.nombre}
                </h3>
                <p className="product-card-price">${p.precio.toLocaleString('es-CL')}</p>
              </div>

              <div className="product-card-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/productos/${p.id}`)}>
                  Ver detalle
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => iniciarEdicion(p)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(p.id)}>
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
            <h3 className="modal-title">¿Eliminar producto?</h3>
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
