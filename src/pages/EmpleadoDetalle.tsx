import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Empleado } from '../types';

export default function EmpleadoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('adonay_empleados');
    if (saved) {
      try {
        const empleados: Empleado[] = JSON.parse(saved);
        const encontrado = empleados.find((e) => e.id === id);
        setEmpleado(encontrado || null);
      } catch (error) {
        console.error('Error al cargar empleado:', error);
        setEmpleado(null);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="page"><p>Cargando...</p></div>;
  }

  if (!empleado) {
    return (
      <div className="page">
        <p>Empleado no encontrado</p>
        <button onClick={() => navigate('/empleados')}>Volver</button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{empleado.nombre} {empleado.apellido}</h1>
      
      <div className="card">
        <p><strong>RUT:</strong> {empleado.rut}</p>
        <p><strong>Email:</strong> {empleado.email}</p>
        <p><strong>Teléfono:</strong> {empleado.telefono}</p>
        <p><strong>Cargo:</strong> {empleado.cargo}</p>
        <p><strong>Rol:</strong> {empleado.rol}</p>
        <p><strong>Fecha de ingreso:</strong> {empleado.fechaIngreso}</p>
        <p><strong>Estado:</strong> {empleado.activo ? 'Activo' : 'Inactivo'}</p>
      </div>

      <div className="button-group">
        <button onClick={() => navigate('/empleados')}>Volver</button>
        <button onClick={() => navigate('/empleados')}>Editar</button>
      </div>
    </div>
  );
}
