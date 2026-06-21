import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Resumen from './pages/Resumen';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Sedes from './pages/Sedes';
import SedeDetalle from './pages/SedeDetalle';
import Empleado from './pages/Empleados';
import EmpleadoDetalle from './pages/EmpleadoDetalle';
import Registro from './pages/Registro'; 
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas protegidas — envueltas en Layout que verifica sesión */}
          <Route element={<Layout />}>
          <Route path="/resumen" element={<Resumen />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/sedes" element={<Sedes />} />
          <Route path="/sedes/:id" element={<SedeDetalle />} />
          <Route path="/empleados" element={<Empleado />} />
          <Route path="/empleados/:id" element={<EmpleadoDetalle />} />
          </Route>

          {/* Redireccionamiento por defecto */}
          <Route path="/" element={<Navigate to="/resumen" replace />} />
          <Route path="*" element={<Navigate to="/resumen" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
