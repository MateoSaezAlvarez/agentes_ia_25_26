//fichero encargado de levantar una API REST con express
//importaciones 
import { config } from 'dotenv';
import express from 'express';
import dataAPI from './db/db.js';
import cors from 'cors';

//variables de entorno
config();
const PORT=process.env.PORT || 4001;
const NODE_ENV=process.env.NODE_ENV;
const SERVER_URL=process.env.SERVER_URL || "http://localhost";
const HOST=process.env.HOST;

const app=express();

//CORS
app.use(cors())

//voy a permitir json como cuerpo de peticiones
app.use(express.json());

//middleware
app.use((req,res,next)=>{
    const timeData=new Date().toISOString();
    console.log(`${timeData} ${req.method} ${req.url} -IP ${req.ip}`)
    next();
})

//Bienvenida
app.get("/",(req,res)=>{
    res.json({
        message:"Mini API de post de cervezas",
        version:"1.0.0",
        endpoints:{
            "GET /beers": "Obtiene todas las cervezas",

        }
    })
});

app.get("/posts",(req,res)=>{
    console.log("Peticion GET para traer las cervezas de la API")
    res.json({
        success:true,
        data:dataAPI,
        //para que se autoincrementen:count:cervezas.length
        count:dataAPI.length
    })
});

app.post("/beers",(req,res)=>{
    console.log("Peticion POST para añadir una cerveza a la API")
})


//levantar el servidor
app.listen(PORT,HOST,()=>{
    console.log(`Servidor de Mateo ->${SERVER_URL}:${PORT}`)
})
