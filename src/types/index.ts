// ─── Entidades del dominio ───────────────────────────────────────────────────

export interface Usuario {
  email: string;
  rol: 'admin' | 'empleado';
  nombre: string;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string; 
  categoria: string;
}

export interface Sede {
  id: string;
  nombre: string;
  ubicacion: string;
  horario: string;
  numeroTelefonico: string;
  imagen: string; 
}

// ─── Contexto de autenticación ───────────────────────────────────────────────

export interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
  telefono: string;
  password: string;  
  rol: 'admin' | 'empleado';
  cargo: string;
  fechaIngreso: string;
  activo: boolean;
}

