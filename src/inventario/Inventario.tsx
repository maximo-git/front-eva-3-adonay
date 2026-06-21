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

  // ✅ GUARDAR (solo cuando cambia)
  useEffect(() => {
    localStorage.setItem(
      "sushi_ingrediente",
      JSON.stringify(ingredientes)
    );
  }, [ingredientes]);

  const guardarIngrediente = (e: React.FormEvent) => {
    e.preventDefault();

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
    } else {
      setIngredientes([...ingredientes, nuevo]);
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
    setIngredientes(ingredientes.filter((_, i) => i !== index));
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

  const ingredientesFiltrados = ingredientes.filter((ing) =>
    ing.nombre.toLowerCase().includes(busqueda.toLowerCase())
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
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <input
                type="text"
                placeholder="Categoría"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />

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
            <th>Stock</th>
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

              <td className={ing.cantidad <= ing.stock ? "stock-bajo" : "stock-ok"}>
                {ing.stock}
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