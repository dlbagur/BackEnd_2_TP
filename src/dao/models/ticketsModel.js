import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { v4 as uuidv4 } from 'uuid';

const ticketsColl = "tickets";
const ticketsSchema = new mongoose.Schema(
    {
        code: { type: String, unique: true, default: () => uuidv4() },
        purchase_datetime: { type: Date},
        amount: { type: Number, required: true },
        purchaser: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

ticketsSchema.plugin(mongoosePaginate);

export const ticketsModelo = mongoose.model(ticketsColl, ticketsSchema);