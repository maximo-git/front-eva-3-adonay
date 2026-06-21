import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Producto, Sede } from '../types';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  onClick?: () => void;
}

function StatCard({ icon, label, value, sub, accent, onClick }: StatCardProps) {
  return (
    <div
      className={`stat-card${accent ? ' stat-card--accent' : ''}${onClick ? ' stat-card--clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
        {sub && <p className="stat-card-sub">{sub}</p>}
      </div>
    </div>
  );
}

export default function Resumen() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);

  // CARGA FORZADA: Leer siempre del localStorage al entrar a la página
  useEffect(() => {
    const p = localStorage.getItem('adonay_productos');
    const s = localStorage.getItem('adonay_sedes');
    if (p) {
      try {
        setProductos(JSON.parse(p));
      } catch (e) {
        console.error("Error al parsear productos", e);
      }
    }
    if (s) {
      try {
        setSedes(JSON.parse(s));
      } catch (e) {
        console.error("Error al parsear sedes", e);
      }
    }
  }, []);

  // Estadísticas calculadas
  const totalProductos = productos.length;
  const totalSedes = sedes.length;
  const precioPromedio = totalProductos > 0
    ? Math.round(productos.reduce((acc, p) => acc + p.precio, 0) / totalProductos)
    : 0;
  const productoMasCaro = totalProductos > 0
    ? productos.reduce((a, b) => (a.precio > b.precio ? a : b))
    : null;

  // Categorías únicas
  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  // Últimos registros
  const ultimosProductos = [...productos].slice(-3).reverse();
  const ultimasSedes = [...sedes].slice(-3).reverse();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resumen</h1>
          <p className="page-subtitle">
            Bienvenido, <strong>{usuario?.nombre}</strong> — Vista general del sistema
          </p>
        </div>
        <span className="badge badge-red">{usuario?.rol}</span>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="🍣"
          label="Total de Productos"
          value={totalProductos}
          sub={`${categorias.length} categoría(s)`}
          accent
          onClick={() => navigate('/productos')}
        />
        <StatCard
          icon="📍"
          label="Total de Sedes"
          value={totalSedes}
          sub="Sucursales activas"
          onClick={() => navigate('/sedes')}
        />
        <StatCard
          icon="💴"
          label="Precio Promedio"
          value={totalProductos > 0 ? `$${precioPromedio.toLocaleString('es-CL')}` : '—'}
          sub="Promedio del menú"
        />
        <StatCard
          icon="⭐"
          label="Producto más caro"
          value={productoMasCaro ? productoMasCaro.nombre : '—'}
          sub={productoMasCaro ? `$${productoMasCaro.precio.toLocaleString('es-CL')}` : ''}
        />
      </div>

      <div className="resumen-grid">
        <div className="resumen-section">
          <div className="resumen-section-header">
            <h2 className="resumen-section-title">Últimos productos</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/productos')}>
              Ver todos →
            </button>
          </div>
          {ultimosProductos.length === 0 ? (
            <p className="empty-text">No hay productos registrados aún.</p>
          ) : (
            <div className="resumen-list">
              {ultimosProductos.map((p) => (
                <div key={p.id} className="resumen-item" onClick={() => navigate(`/productos/${p.id}`)}>
                  <div className="resumen-item-img">
                    {p.imagen ? (
                      <img src={p.imagen} alt={p.nombre} />
                    ) : (
                      <span>🍣</span>
                    )}
                  </div>
                  <div className="resumen-item-info">
                    <p className="resumen-item-name">{p.nombre}</p>
                    <p className="resumen-item-sub">{p.categoria}</p>
                  </div>
                  <p className="resumen-item-price">${p.precio.toLocaleString('es-CL')}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="resumen-section">
          <div className="resumen-section-header">
            <h2 className="resumen-section-title">Últimas sedes</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/sedes')}>
              Ver todas →
            </button>
          </div>
          {ultimasSedes.length === 0 ? (
            <p className="empty-text">No hay sedes registradas aún.</p>
          ) : (
            <div className="resumen-list">
              {ultimasSedes.map((s) => (
                <div key={s.id} className="resumen-item" onClick={() => navigate(`/sedes/${s.id}`)}>
                  <div className="resumen-item-img resumen-item-img--sede">
                    {s.imagen ? (
                      <img src={s.imagen} alt={s.nombre} />
                    ) : (
                      <span>📍</span>
                    )}
                  </div>
                  <div className="resumen-item-info">
                    <p className="resumen-item-name">{s.nombre}</p>
                    <p className="resumen-item-sub">{s.ubicacion}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {categorias.length > 0 && (
        <div className="resumen-section" style={{ marginTop: '24px' }}>
          <h2 className="resumen-section-title" style={{ marginBottom: '16px' }}>
            Productos por categoría
          </h2>
          <div className="categoria-grid">
            {categorias.map((cat) => {
              const count = productos.filter((p) => p.categoria === cat).length;
              const pct = Math.round((count / totalProductos) * 100);
              return (
                <div key={cat} className="categoria-item">
                  <div className="categoria-header">
                    <span className="categoria-name">{cat}</span>
                    <span className="categoria-count">{count} producto(s)</span>
                  </div>
                  <div className="categoria-bar-bg">
                    <div className="categoria-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="categoria-pct">{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
