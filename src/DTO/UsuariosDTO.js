    export default class UsuariosDTO {
        constructor(usuario = {}) {
            this.first_name = usuario.first_name ? usuario.first_name.toUpperCase() : "N/A";
            this.last_name = usuario.last_name ? usuario.last_name.toUpperCase() : "N/A";
            this.full_name = `${this.first_name} ${this.last_name}`;
            this.email = usuario.email || "No Email";
            this.userName = usuario.email ? usuario.email.split("@")[0] : "No Username";
            this.role = usuario.role || "user";
            this.age = usuario.age || null;
        }
    }
    