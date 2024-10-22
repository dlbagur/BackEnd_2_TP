import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsColl = "carts";
const cartsSchema = new mongoose.Schema(
    {
        usuario: String,
        productos: {
            type: [
                {
                    producto: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products"
                    },
                    quantity: {
                        type: Number,
                        default: 1
                    }
                }
            ]
        }
    }
);

cartsSchema.plugin(mongoosePaginate);

export const cartsModelo = mongoose.model(cartsColl, cartsSchema);
