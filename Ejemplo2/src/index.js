import dotenv from "dotenv";

//AÑADO las variables .env a este fichero
dotenv.config();
//las variables están en process.env.nombreVariable

//mostrar por consola las variables de entorno
console.log("URL de acceso: ",process.env.URL);
console.log("Puerto: ", process.env.PORT);
console.log(`URL con Puerto: ${process.env.URL}:${Number(process.env.PORT)+1}`)