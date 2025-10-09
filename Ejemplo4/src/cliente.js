//el fichero cliente lanzará peticiones a la API REST

const traerPostCervezas= async () => {
    try{
         const response= await fetch("http://192.168.70.145:4000/posts");
        const data= await response.json();
        console.log(data);
    }catch(error){
        console.log(error);
    }
}

//async y await van de la mano SIEMPRE