import { Router } from "express";
import CartsManager from '../dao/CartsManager.js';
import TicketManager from '../dao/TicketManager.js';
import { isValidObjectId } from "mongoose";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        if (!cartId) {
            return res.status(400).json({ error: `No hay un carrito asociado` });
        }        
        let cart = await CartsManager.getCartById(cartId);
        if (!cart) {
            return res.status(400).json({ error: `No existe carrito para mostrar` });
        }
        return res.status(200).json({ cart });
    } catch (error) {
        return res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
    }
});

router.post('/', async (req, res) => {
    const cartId = req.cookies.cartId;
    if (!cartId) {
        return res.status(400).json({ error: `No hay un carrito asociado` });
    }        
    try {
        let cart = await CartsManager.getCartById(cartId);
        if (!cart) {
            return res.status(400).json({ error: `No existe el carrito con ID ${cartId}` });
        }
        let { compra, sinStock } = await CartsManager.purchase(cartId);
        return res.status(200).json({ message: `Compra efectuada`, compra, sinStock });
    } catch (error) {
        return res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
    }
});

export default router;
