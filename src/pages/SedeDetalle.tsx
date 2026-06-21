import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Sede } from '../types';

export default function SedeDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sede, setSede] = useState<Sede | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('adonay_sedes');
    if (saved) {
      const lista: Sede[] = JSON.parse(saved);
      const found = lista.find((s) => s.id === id);
      setSede(found ?? null);
    }
  }, [id]);

  if (!sede) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-state-icon">🔍</span>
          <p className="empty-state-text">Sede no encontrada.</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/sedes')}>
            Volver a Sedes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/sedes')}>
          ← Volver
        </button>
      </div>

      <div className="detalle-card">
        {/* Imagen */}
        <div className="detalle-img">
          {sede.imagen ? (
            <img src={sede.imagen} alt={sede.nombre} />
          ) : (
            <div className="detalle-img-placeholder">📍</div>
          )}
        </div>

        {/* Información */}
        <div className="detalle-info">
          <h1 className="detalle-title">{sede.nombre}</h1>

          <div className="detalle-section">
            <h3 className="detalle-section-title">Ubicación</h3>
            <p className="detalle-section-text">📍 {sede.ubicacion}</p>
          </div>

          <div className="detalle-section">
            <h3 className="detalle-section-title">Horario de atención</h3>
            <p className="detalle-section-text">🕐 {sede.horario}</p>
          </div>

          <div className="detalle-section">
            <h3 className="detalle-section-title">Contacto</h3>
            <p className="detalle-section-text">📞 {sede.numeroTelefonico}</p>
          </div>

          <div className="detalle-section">
            <h3 className="detalle-section-title">Identificador</h3>
            <code className="detalle-id">{sede.id}</code>
          </div>

          <div className="detalle-actions">
            <button className="btn btn-primary" onClick={() => navigate('/sedes')}>
              Volver al listado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
