import { UsuariosDTO } from "./UsuariosDTO.js"

let dataFromBody = {
        nombre:"Juan", 
        apellido:"Fernandez",
        email:"jfernandez@test.com"
   
}

let usuarioFormateado=new UsuariosDTO(dataFromBody)
console.log(usuarioFormateado)
