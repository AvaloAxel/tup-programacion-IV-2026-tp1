import express from "express";

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

// Arreglo de alumnos
let alumnos = [
  { id: 1, nombre: "Juan", nota1: 7, nota2: 8, nota3: 6 },
  { id: 2, nombre: "Pedro", nota1: 5, nota2: 4, nota3: 6 },
  { id: 3, nombre: "Maria", nota1: 9, nota2: 8, nota3: 10 },
];

let nextId = 4;

app.get("/", (req, res) => {
  res.send("API de alumnos funcionando");
});

// GET para consultar todos los alumnos
app.get("/alumnos", (req, res) => {
  const alumnosCalculados = alumnos.map((a) => {
    const promedio = (a.nota1 + a.nota2 + a.nota3) / 3;

    let condicion;

    if (promedio < 6) {
      condicion = "Reprobado";
    } else if (promedio < 8) {
      condicion = "Aprobado";
    } else {
      condicion = "Promocionado";
    }

    return {
      ...a,
      promedio: promedio,
      condicion: condicion,
    };
  });

  res.send(alumnosCalculados);
});

// GET para consultar un alumno por id
app.get("/alumnos/:id", (req, res) => {
  // Extraigo el id de los parametros de la ruta
  const id = Number(req.params.id);

  // Busco el alumno
  const alumno = alumnos.find((a) => a.id === id);

  // Verificar si existe
  if (!alumno) {
    return res.status(404).send("Alumno no encontrado");
  }

  // Calcular promedio
  const promedio = (alumno.nota1 + alumno.nota2 + alumno.nota3) / 3;

  // Calcular condicion
  let condicion;

  if (promedio < 6) {
    condicion = "Reprobado";
  } else if (promedio < 8) {
    condicion = "Aprobado";
  } else {
    condicion = "Promocionado";
  }

  const resultado = {
    ...alumno,
    promedio: promedio,
    condicion: condicion,
  };

  res.send(resultado);
});

// POST para crear un nuevo alumno
app.post("/alumnos", (req, res) => {
  // Extraigo los datos del body
  const { nombre, nota1, nota2, nota3 } = req.body;

  // Validar las notas
  if (
    typeof nota1 !== "number" ||
    typeof nota2 !== "number" ||
    typeof nota3 !== "number" ||
    nota1 < 0 ||
    nota1 > 10 ||
    nota2 < 0 ||
    nota2 > 10 ||
    nota3 < 0 ||
    nota3 > 10
  ) {
    return res.status(400).send("Las notas deben estar entre 0 y 10");
  }

  // Verificar que no exista otro alumno con el mismo nombre
  const alumnoExistente = alumnos.find(
    (a) => a.nombre.toLowerCase() === nombre.toLowerCase(),
  );

  if (alumnoExistente) {
    return res.status(400).send("Ya existe un alumno con ese nombre");
  }

  // Crear nuevo alumno
  const nuevoAlumno = {
    id: nextId++,
    nombre: nombre.trim(),
    nota1: nota1,
    nota2: nota2,
    nota3: nota3,
  };

  // Agregar al arreglo
  alumnos.push(nuevoAlumno);

  // Calcular promedio
  const promedio = (nota1 + nota2 + nota3) / 3;

  // Calcular condicion
  let condicion;

  if (promedio < 6) {
    condicion = "Reprobado";
  } else if (promedio < 8) {
    condicion = "Aprobado";
  } else {
    condicion = "Promocionado";
  }

  const resultado = {
    ...nuevoAlumno,
    promedio: promedio,
    condicion: condicion,
  };

  res.status(201).send(resultado);
});

// PUT para modificar un alumno
app.put("/alumnos/:id", (req, res) => {
  // Extraigo el id
  const id = Number(req.params.id);

  // Buscar alumno
  const alumnoEncontrado = alumnos.find((a) => a.id === id);

  if (!alumnoEncontrado) {
    return res.status(404).send("Alumno no encontrado");
  }

  // Extraigo los datos del body
  const { nombre, nota1, nota2, nota3 } = req.body;

  // Validar las notas
  if (
    typeof nota1 !== "number" ||
    typeof nota2 !== "number" ||
    typeof nota3 !== "number" ||
    nota1 < 0 ||
    nota1 > 10 ||
    nota2 < 0 ||
    nota2 > 10 ||
    nota3 < 0 ||
    nota3 > 10
  ) {
    return res.status(400).send("Las notas deben estar entre 0 y 10");
  }

  // Verificar que no exista otro alumno con el mismo nombre
  const alumnoExistente = alumnos.find(
    (a) => a.id !== id && a.nombre.toLowerCase() === nombre.toLowerCase(),
  );

  if (alumnoExistente) {
    return res.status(400).send("Ya existe un alumno con ese nombre");
  }

  // Modificar alumno
  alumnoEncontrado.nombre = nombre.trim();
  alumnoEncontrado.nota1 = nota1;
  alumnoEncontrado.nota2 = nota2;
  alumnoEncontrado.nota3 = nota3;

  // Calcular promedio
  const promedio = (nota1 + nota2 + nota3) / 3;

  // Calcular condicion
  let condicion;

  if (promedio < 6) {
    condicion = "Reprobado";
  } else if (promedio < 8) {
    condicion = "Aprobado";
  } else {
    condicion = "Promocionado";
  }

  const resultado = {
    ...alumnoEncontrado,
    promedio: promedio,
    condicion: condicion,
  };

  res.send(resultado);
});

// DELETE para eliminar un alumno
app.delete("/alumnos/:id", (req, res) => {
  // Extraigo el id
  const id = Number(req.params.id);

  // Buscar alumno
  const alumnoEncontrado = alumnos.find((a) => a.id === id);

  if (!alumnoEncontrado) {
    return res.status(404).send("Alumno no encontrado");
  }

  // Eliminar alumno
  alumnos = alumnos.filter((a) => a.id !== id);

  // Responder con alumno eliminado
  res.send(alumnoEncontrado);
});

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en ${port}`);
});