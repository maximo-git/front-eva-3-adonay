import { useState, useEffect } from "react";
import "./inventario.css";

interface Ingrediente {
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
  stock: number;
}

function Inventario() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>(() => {
    const datos = localStorage.getItem("sushi_ingrediente");
    return datos ? JSON.parse(datos) : [];
  });

  const [busqueda, setBusqueda] = useState("");

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const [indiceEditar, setIndiceEditar] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("sushi_ingrediente", JSON.stringify(ingredientes));
  }, [ingredientes]);

  // 🔥 SISTEMA DE OPCIONES
  const obtenerOpciones = () => {
    const n = nombre.toLowerCase();

    if (n.includes("arroz")) {
      return [
        "Arroz Graneado",
        "Arroz Integral",
        "Grano corto",
        "Grano largo",
        "Jazmín",
        "Basmati",
        "Precocido",
      ];
    }

    if (n.includes("pescado")) {
      return ["Reineta", "Merluza", "Salmón", "Congrio", "Jurel", "Corvina"];
    }

    if (n.includes("carne")) {
      return ["Costillar", "Cerdo", "Pollo", "Filete", "Pavo", "Marinada"];
    }

    if (n.includes("mariscos")) {
      return [
        "Choritos (Meillones)",
        "Machas",
        "Almejas",
        "Locos",
        "Ostiones",
        "Choras y Maltones",
      ];
    }

    if (n.includes("verduras")) {
      return [
        "Tomate",
        "Cebolla",
        "Palta",
        "Lechuga",
        "Repollo",
        "Apio",
        "Zanahoria",
        "Acelga y Espinaca",
      ];
    }

    if (n.includes("salsa")) {
      return [
        "Salsa de Soya",
        "Salsa Teriyaki",
        "Salsa Unagi",
        "Salsa Acevichada",
        "Salsa Ponzu",
      ];
    }

    if (n.includes("queso")) {
      return [
        "Queso Gauda",
        "Queso Crema",
        "Queso parmesano",
        "Queso Mozzarella",
        "Quesillo",
        "Queso mantecoso",
      ];
    }

    return ["frutas","otros"];
  };

  const opcionesCategoria = obtenerOpciones();

  const guardarIngrediente = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !categoria || !cantidad || !precio || !stock) {
      alert("⚠️ Completa todos los campos");
      return;
    }

    const nuevo: Ingrediente = {
      nombre,
      categoria,
      cantidad: Number(cantidad),
      precio: Number(precio),
      stock: Number(stock),
    };

    if (indiceEditar !== null) {
      const copia = [...ingredientes];
      copia[indiceEditar] = nuevo;
      setIngredientes(copia);
      alert("✅ Ingrediente actualizado");
    } else {
      setIngredientes([...ingredientes, nuevo]);
      alert("✅ Ingrediente agregado");
    }

    cerrarModal();
  };

  const editarIngrediente = (index: number) => {
    const ing = ingredientes[index];

    setNombre(ing.nombre);
    setCategoria(ing.categoria);
    setCantidad(String(ing.cantidad));
    setPrecio(String(ing.precio));
    setStock(String(ing.stock));

    setIndiceEditar(index);
    setMostrarModal(true);
  };

  const eliminarIngrediente = (index: number) => {
    if (!confirm("¿Eliminar ingrediente?")) return;

    const nuevaLista = ingredientes.filter((_, i) => i !== index);
    setIngredientes(nuevaLista);

    alert("🗑️ Eliminado correctamente");
  };

  const cerrarModal = () => {
    setNombre("");
    setCategoria("");
    setCantidad("");
    setPrecio("");
    setStock("");
    setIndiceEditar(null);
    setMostrarModal(false);
  };

  const ingredientesFiltrados = ingredientes.filter(
    (ing) =>
      ing.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ing.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatearPrecio = (valor: number) =>
    valor.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    });

  return (
    <div className="inventario-container">
      <div className="header">
        <h2>Inventario</h2>
        <button onClick={() => setMostrarModal(true)}>
          + Agregar ingrediente
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {indiceEditar !== null ? "Editar" : "Agregar"} ingrediente
            </h3>

            <form onSubmit={guardarIngrediente}>
              <input
                type="text"
                placeholder="Nombre (ej: pollo, arroz, salmón...)"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setCategoria(""); // 👈 limpia solo al escribir
                }}
              />

              <select
                value={categoria || ""}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Seleccionar tipo</option>

                {[...new Set([categoria, ...opcionesCategoria])]
                  .filter(Boolean)
                  .map((op, i) => (
                    <option key={i} value={op}>
                      {op}
                    </option>
                  ))}
              </select>

              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />

              <input
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />

              <input
                type="number"
                placeholder="Stock mínimo"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />

              <div className="modal-buttons">
                <button type="submit">
                  {indiceEditar !== null ? "Actualizar" : "Guardar"}
                </button>

                <button type="button" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Stock mínimo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ingredientesFiltrados.map((ing, index) => (
            <tr key={index}>
              <td>{ing.nombre}</td>
              <td>{ing.categoria}</td>
              <td>{ing.cantidad}</td>
              <td>{formatearPrecio(ing.precio)}</td>
              <td>{ing.stock}</td>

              <td
                className={
                  ing.cantidad <= ing.stock ? "stock-bajo" : "stock-ok"
                }
              >
                {ing.cantidad <= ing.stock ? "⚠️ Bajo" : "✅ OK"}
              </td>

              <td>
                <button onClick={() => editarIngrediente(index)}>
                  Editar
                </button>
                <button onClick={() => eliminarIngrediente(index)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventario;
