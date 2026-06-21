import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, Usuario, Empleado } from '../types';

// ─── Usuarios válidos (simulados) ────────────────────────────────────────────
const USUARIOS_VALIDOS: Array<{ email: string; password: string; nombre: string; rol: 'admin' | 'empleado' }> = [
  { email: 'admin@adonay.com', password: 'admin123', nombre: 'Administrador', rol: 'admin' },
  { email: 'empleado@adonay.com', password: 'emp123', nombre: 'Empleado', rol: 'empleado' },
];

// Función para obtener empleados desde localStorage
const getEmpleadosDelStorage = (): Empleado[] => {
  try {
    const saved = localStorage.getItem('adonay_empleados');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión persistida al montar
  useEffect(() => {
    const saved = localStorage.getItem('adonay_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Usuario;
        // Validación extra: si falta el nombre o rol, limpiar para evitar errores
        if (!parsed.nombre || !parsed.rol) {
          localStorage.removeItem('adonay_user');
          setUsuario(null);
        } else {
          setUsuario(parsed);
        }
      } catch {
        localStorage.removeItem('adonay_user');
        setUsuario(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Primero intentar con empleados del localStorage
    const empleados = getEmpleadosDelStorage();
    const empleadoEncontrado = empleados.find(
      (e) => e.email === email && e.activo === true
    );

    if (empleadoEncontrado) {
      // Si el empleado existe, verificar la contraseña
      if (password === empleadoEncontrado.password) {
        const user: Usuario = {
          email: empleadoEncontrado.email,
          rol: empleadoEncontrado.rol,
          nombre: empleadoEncontrado.nombre,
        };
        localStorage.setItem('adonay_user', JSON.stringify(user));
        setUsuario(user);
        return true;
      }
    }

    // Si no hay empleados o no coincide, intentar con USUARIOS_VALIDOS
    const found = USUARIOS_VALIDOS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const user: Usuario = { email: found.email, rol: found.rol, nombre: found.nombre };
      localStorage.setItem('adonay_user', JSON.stringify(user));
      setUsuario(user);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('adonay_user');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}