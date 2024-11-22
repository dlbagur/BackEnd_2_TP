export class UsuariosDTO{
    constructor(usuario){
        this.first_name = usuario.first_name.toUpperCase()
        this.last_name = usuario.last_name.toUpperCase()
        this.full_name = this.first_name + " " + this.last_name
        this.email = usuario.email
        this.userName = usuario.email.split("@")[0]
        this.role = usuario.role
        this.age = usuario.age
    }
}