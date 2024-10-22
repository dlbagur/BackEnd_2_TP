import { usuariosModel } from "./models/usuariosModel.js"

export class UsuariosManager{
    
    static async create(usuario) {
        let nuevoUsuario=await usuariosModel.create(usuario)
        return nuevoUsuario.toJSON()
    }

    static async getBy(filtro){
        return await usuariosModel.findOne(filtro).lean()
    }

}
