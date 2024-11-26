import { usuariosModel } from "./models/usuariosModel.js"

export class usuariosMongoDAO{
    
    static async createUser(usuario) {
        let nuevoUsuario=await usuariosModel.create(usuario)
        return nuevoUsuario.toJSON()
    }

    static async getUserBy(filtro){
        return await usuariosModel.findOne(filtro).lean()
    }

}
