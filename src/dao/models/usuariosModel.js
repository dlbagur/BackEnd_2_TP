import mongoose from "mongoose";

export const usuariosModel=mongoose.model(
    "usuarios",
    new mongoose.Schema(
        {
            nombre: String,
            apellido: String,
            email: {type: String, unique: true},
            age: Number,
            password: String,
            cart: String,
            rol: {type: String, default:"user"}
        },
        {
            timestamps: true, 
            strict: false
        }
    )
)
