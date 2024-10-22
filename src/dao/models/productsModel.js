import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsSchema=new mongoose.Schema(
    {
        id: Number,
        category: String,
        title: String,
        code: 
        {
            type: String, unique: true
        },
        price: Number,
        status:
        {
            type: Boolean,
            default: true
        },
        description: String,
        thumbnails: [],
        stock: 
        {   type: Number, default: 0    }
    },
    {
        timestamps: true,
    }
)

productsSchema.plugin(mongoosePaginate)

export const productosModelo=mongoose.model(
    'products',
    productsSchema
)
