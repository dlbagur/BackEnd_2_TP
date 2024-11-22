import mongoose from "mongoose";

export const usuariosModel=mongoose.model(
    "usuarios",
    new mongoose.Schema(
        {
            first_name: String,
            last_name: String,
            email: {type: String, unique: true},
            age: Number,
            password: String,
            cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
            role: {type: String, default:"user"}
        },
        {
            timestamps: true, 
            strict: false
        }
    )
)
