import { config } from "dotenv";
import express from "express";
import cors from "cors";

//cargamos las variables
config();

//iniciamos la aplicacion de express
const app = express();
const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";
const SERVER_URL = process.env.SERVER_URL || `http://${HOST}:${PORT}`;
const AI_API_URL = process.env.AI_API_URL || "http://localhost:11434";
const AI_MODEL = process.env.AI_MODEL || "llama3.2:1b";

//middleware
app.use(cors());
app.use(express.json());

//ruta de prueba
//1.- info de estado
const getAppInfo = () =>({
    name: "Mini Server backend ollama",
    version: "1.0.0",
    status: "running", 
    description: "Servidor backend para manejar solicitudes de ollama",
    endpoints: {
        "GET /api": "Información básica del servidor y del modelo de IA",
        "GET /api/modelos": "Información del modelo de IA configurado en ollama",
        "POST /api/consulta": "Enviar un prompt al modelo de IA y recibir una respuesta",
    },
    model: AI_MODEL,
    host: `${HOST}:${PORT}`,
    ollama: {
        url: AI_API_URL,
    }
});

//endpoints usados

//endpoint de informacion basica
app.get("/", (req, res) => {
    res.json(getAppInfo());
});

//endpoint /api
app.get("/", (req, res) => {
    res.json(getAppInfo());
});

//endpoint para obtener informacion del moelo de IA configurado en ollama
app.get("/api/modelos", async (req, res) => {
    try {
        const response = await fetch(`${AI_API_URL}/api/tags`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(5000),
        })
        if(!response.ok){
            return res.status(response.status).json({error: `error fetching ollama: ${response.statusText}`});
        }
        const data = await response.json();
        const modelos = data.models || [];
        res.json({
            total: modelos.length,
            modelos,
            origen: AI_API_URL,
        });
    } catch (error) {
        res.status(502).json({
            error: "Error al obtener los modelos",
            message: error.message
        })
    }
});

//endpoint para enviar una consulta al modelo de IA
app.post("/api/consulta", async (req, res) => {
    const { prompt, model } = req.body || {};
    if(!prompt || typeof prompt !== "string"){
        return res
            .status(400)
            .json({error: "Prompt es requerido y debe ser una cadena de texto"
            });
    }
    const targetModel = model || AI_MODEL;
    try {
        //peticion a ollama
        const response = await fetch(`${AI_API_URL}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: targetModel,
                prompt,
                stream: false
            }),
            signal: AbortSignal.timeout(20000),
        });
        if(!response.ok){
            return res.status(response.status).json({
                error: `Error al enviar la consulta: ${response.statusText}`,
            });
        }
        const data = await response.json();
        res.json({
            prompt,
            modelo: targetModel,
            response: data.response || "",
            latencyMs : data.latencyMs || undefined,
            origen: AI_API_URL
        });
    } catch (error) {
        res.status(502).json({
            error: "Error al comunicarse con el modelo",
            message: error.message
        })
    }
});

//lanzamos el servidor de express con los endpoints definidos
app.listen(PORT, HOST, () => {
    //const aiUrl = process.env.AI_API_URL || "http://ollama:11434";
    console.log(
        `=====================================
        Mini Server backend ollama by mateosaez
        Servidor backend escuchando en ${SERVER_URL} (entorno: ${process.env.NODE_ENV})
        Por favor, accede a: ${SERVER_URL}/api para ver la información del servidor.
        Asegúrate de que el servicio de IA esté corriendo en ${AI_API_URL}`
    );
});

export default app;