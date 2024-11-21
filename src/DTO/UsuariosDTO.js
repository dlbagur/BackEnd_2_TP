export class UsuariosDTO{
    constructor(usuario){
        this.nombre = usuario.name.toUpperCase()
        this.apellido = usuario.apellido.toUpperCase()
        this.nombreCompleto = this.nombre + " " + this.apellido
        this.email = usuario.email
        this.userName = usuario.email.split("@")[0]
        this.rol = usuario.rol
        this.edad = usuario.edad
    }
}

