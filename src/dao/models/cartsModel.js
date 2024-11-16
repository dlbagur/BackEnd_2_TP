import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsColl = "carts";
const cartsSchema = new mongoose.Schema(
    {
        productos: [
            {
                producto: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                comprado: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        usuario: {
            type: String,
            unique: true
        }
    }
);

cartsSchema.plugin(mongoosePaginate);

export const cartsModelo = mongoose.model(cartsColl, cartsSchema);
