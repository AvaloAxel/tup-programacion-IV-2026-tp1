import express from "express";

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

// Arreglo de rectangulos
let rectangulos = [
    { id: 1, base: 10, altura: 5 },
    { id: 2, base: 8, altura: 8 },
    { id: 3, base: 12, altura: 4 },
];

let nextId = 4;

app.get("/", (req, res) => {
    res.send("API de rectangulos funcionando");
});

// GET para consultar todos los rectangulos
app.get("/rectangulos", (req, res) => {
    const rectangulosCalculados = rectangulos.map((r) => ({
        ...r,
        perimetro: 2 * (r.base + r.altura),
        superficie: r.base * r.altura,
        esCuadrado: r.base === r.altura,
    }));

    res.send(rectangulosCalculados);
});

// GET para consultar un rectangulo a partir de su id
app.get("/rectangulos/:id", (req, res) => {
    // Extraigo el id de los parametros de la ruta
    const id = Number(req.params.id);

    // Buscar el rectangulo
    const rectangulo = rectangulos.find((r) => r.id === id);

    // Verificar si existe
    if (!rectangulo) {
        return res.status(404).send("Rectangulo no encontrado");
    }

    // Calcular datos
    const resultado = {
        ...rectangulo,
        perimetro: 2 * (rectangulo.base + rectangulo.altura),
        superficie: rectangulo.base * rectangulo.altura,
        esCuadrado: rectangulo.base === rectangulo.altura,
    };

    res.send(resultado);
});

// GET para consultar solamente los cuadrados
app.get("/cuadrados", (req, res) => {
    const cuadrados = rectangulos
        .filter((r) => r.base === r.altura)
        .map((r) => ({
            ...r,
            perimetro: 2 * (r.base + r.altura),
            superficie: r.base * r.altura,
            esCuadrado: true,
        }));

    res.send(cuadrados);
});

// POST para crear un nuevo rectangulo
app.post("/rectangulos", (req, res) => {
    // Extraigo los atributos del body
    const { base, altura } = req.body;

    // Validar que los valores sean numeros positivos
    if (
        typeof base !== "number" ||
        typeof altura !== "number" ||
        !Number.isFinite(base) ||
        !Number.isFinite(altura) ||
        base <= 0 ||
        altura <= 0
    ) {
        return res.status(400).send("Base y altura deben ser numeros positivos");
    }

    // Crear un nuevo rectangulo
    const nuevoRectangulo = {
        id: nextId++,
        base: base,
        altura: altura,
    };

    // Agregar al arreglo
    rectangulos.push(nuevoRectangulo);

    // Calcular datos
    const resultado = {
        ...nuevoRectangulo,
        perimetro: 2 * (base + altura),
        superficie: base * altura,
        esCuadrado: base === altura,
    };

    // Responder
    res.status(201).send(resultado);
});

// PUT para modificar un rectangulo
app.put("/rectangulos/:id", (req, res) => {
    // Extraigo el id de los parametros de la ruta
    const id = Number(req.params.id);

    // Buscar el rectangulo
    const rectanguloEncontrado = rectangulos.find((r) => r.id === id);

    if (!rectanguloEncontrado) {
        return res.status(404).send("Rectangulo no encontrado");
    }

    // Extraigo los datos del body
    const { base, altura } = req.body;

    // Validar los datos
    if (
        typeof base !== "number" ||
        typeof altura !== "number" ||
        !Number.isFinite(base) ||
        !Number.isFinite(altura) ||
        base <= 0 ||
        altura <= 0
    ) {
        return res.status(400).send("Base y altura deben ser numeros positivos");
    }

    // Modificar el rectangulo
    rectanguloEncontrado.base = base;
    rectanguloEncontrado.altura = altura;

    // Calcular datos
    const resultado = {
        ...rectanguloEncontrado,
        perimetro: 2 * (base + altura),
        superficie: base * altura,
        esCuadrado: base === altura,
    };

    // Responder con el rectangulo modificado
    res.send(resultado);
});

// DELETE para eliminar un rectangulo
app.delete("/rectangulos/:id", (req, res) => {
    // Extraigo el id de los parametros de la ruta
    const id = Number(req.params.id);

    // Buscar el rectangulo
    const rectanguloEncontrado = rectangulos.find((r) => r.id === id);

    if (!rectanguloEncontrado) {
        return res.status(404).send("Rectangulo no encontrado");
    }

    // Eliminar del arreglo
    rectangulos = rectangulos.filter((r) => r.id !== id);

    // Responder con el rectangulo eliminado
    res.send(rectanguloEncontrado);
});

app.listen(port, () => {
    console.log(`La aplicacion esta funcionando en ${port}`);
});