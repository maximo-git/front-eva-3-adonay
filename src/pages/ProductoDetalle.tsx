import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Producto } from '../types';

export default function ProductoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('adonay_productos');
    if (saved) {
      const lista: Producto[] = JSON.parse(saved);
      const found = lista.find((p) => p.id === id);
      setProducto(found ?? null);
    }
  }, [id]);

  if (!producto) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <p className="empty-state-text">Producto no encontrado.</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/productos')}>
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/productos')}>
          ← Volver
        </button>
      </div>

      <div className="detalle-card">
        {/* Imagen */}
        <div className="detalle-img">
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} />
          ) : (
            <div className="detalle-img-placeholder">🍣</div>
          )}
        </div>

        {/* Información */}
        <div className="detalle-info">
          <span className="badge badge-red">{producto.categoria}</span>
          <h1 className="detalle-title">{producto.nombre}</h1>
          <p className="detalle-price">${producto.precio.toLocaleString('es-CL')}</p>

          {producto.descripcion && (
            <div className="detalle-section">
              <h3 className="detalle-section-title">Descripción</h3>
              <p className="detalle-section-text">{producto.descripcion}</p>
            </div>
          )}

          <div className="detalle-section">
            <h3 className="detalle-section-title">Identificador</h3>
            <code className="detalle-id">{producto.id}</code>
          </div>

          <div className="detalle-actions">
            <button className="btn btn-primary" onClick={() => navigate('/productos')}>
              Volver al listado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
