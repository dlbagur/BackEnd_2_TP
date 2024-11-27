import { usuariosMongoDAO as usuariosDAO} from "../DAO/usuariosMongoDAO.js"

class UsuariosService{
    constructor(DAO){
        this.usuariosDAO=DAO
    }
    async getUsers(){
        return await this.usuariosDAO.get()
    }
}

export const usersService=new UsuariosService(usuariosDAO)
