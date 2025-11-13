import express from "express";
import cors from "cors";
import { config } from "dotenv";

//cargar las variables de entorno cargadas en memoria
config();
//crear servidor express
const app = express();
//crear variables basandonos en las variables de entorno
const PORT=Number(process.env.PORT)    || 3002
const HOST=process.env.HOST    ||  "0.0.0.0"
const NODE_ENV=process.env.NODE_ENV    || "development"
const SERVER_URL=process.env.SERVER_URL    || "http://localhost:3002"
const AI_API_URL=process.env.AI_API_URL    || "http://localhost:11434"
const AI_MODEL=process.env.AI_MODEL    || "llama3.2:1b"

//paso middleware:
//a) Habilitar los cors en los navegadores
app.use(cors());
//b) Habilitar JSON para preguntas y respuestas
app.use(express.json());


//(opcional) crear funcion que muestre información al usuario
const getInfoApi = () =>  ({
        service : "Servicio API Ollama",
        status : "ready",
        endpoints : {
            "GET /api": "Mostramos información de la API Ollama",
            "GET /api/modelos":"Mostramos información de los modelos disponibles",
            "POST /api/consulta" : "Envía un prompt para realizar consultas a la IA"
        },
        model: AI_MODEL,
        host: `${HOST}:${PORT}`,
        ollama_url : AI_API_URL, 
    });

//generar los endpoints

//--> /

app.get("/",(req, res)=>{
    res.json(getInfoApi())
})

// --> /api
app.get("/api",(req, res)=>{
    res.json(getInfoApi())
})

// Levantar el servidor express para escuchar peticiones a los endpoints


app.get("/api/modelos",async(req, res)=>{
    try{
        const response = await fetch(`${AI_API_URL}/api/tags`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(5000),
        })
        if(!response.ok) throw new Error("Error al realizar la petición");
        const data = await response.json();
        const models = data.models.map((model) => ({modelo: model.name})) || []; //simplificado data.models.map(model.name);
        res.json(models);

    }catch(error){
        res.status(502).json({
            error: "Fallo en el acceso al servidor con los modelos",
            message: error.message,
        });
    }
})


//---> /api/consulta

app.post("/api/consulta", async(req,res)=>{
    const { prompt, model } = req.body || {};
    if(!prompt || typeof prompt !== "string"){
        return res.status(400).json({
            error: "Error al escribir el prompt",
            message: error.message,
        });
    }

    const modelSelect = model || AI_MODEL
    try {
        const response = await fetch(`${AI_API_URL}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model:modelSelect,
                prompt,
                stream : false,
            }),
            signal: AbortSignal.timeout(30000),
        });
        if(!response.ok) throw new Error("Error al realizar la petición");
        const data=await response.json();
        res.json({
            prompt,
            model: modelSelect,
            response: data.response
        });
    } catch (error) {
        res.status(502).json({
            error: "Fallo en el acceso al servidor con los modelos",
            message: error.message,
        });
    }    
});

// ---> /api/chat
app.post("/api/chat", async(req,res)=>{
    const { prompt, model } = req.body || {};
    if(!prompt || typeof prompt !== "string"){
        return res.status(400).json({
            error: "Error al escribir el prompt",
            message: error.message,
        });
    }

    const modelSelect = model || AI_MODEL
    try {
        const response = await fetch(`${AI_API_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model:modelSelect,
                prompt,
                stream : false,
            }),
            signal: AbortSignal.timeout(30000),
        });
        if(!response.ok) throw new Error("Error al realizar la petición");
        const data=await response.json();
        res.json({
            prompt,
            "messages": [{
                "role": "",
                "content":""
            }],
            model: modelSelect,
            response: data.response
        });
    } catch (error) {
        res.status(502).json({
            error: "Fallo en el acceso al servidor con los modelos",
            message: error.message,
        });
    }    
});



app.listen(PORT, HOST, () =>{
    console.log("---------- Servidor express funcionando ----------");
    console.log(`\t Servidor escuchando en http://${HOST} en el puerto ${PORT}`);
    console.log("\t Escuchando peticiones...")
});
