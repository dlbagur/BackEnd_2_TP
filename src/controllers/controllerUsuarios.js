import { UsuariosDTO } from "./UsuariosDTO.js"

let dataFromBody = {
        first_name:"Juan", 
        last_name:"Fernandez",
        email:"jfernandez@test.com"
   
}

let usuarioFormateado=new UsuariosDTO(dataFromBody)
console.log(usuarioFormateado)
