import mongoose from "mongoose";

export class connDB{
    static #instancia=null

    constructor(url, db){
        mongoose.connect(url, {dbName: db})
    }

    static conectar(url, db){
        if(!this.#instancia){
            this.#instancia=new connDB(url, db)
            console.log(`DB Online`)
        }
        return this.#instancia
    }
}
