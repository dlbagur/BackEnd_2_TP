import { Router } from "express";
import CartsManager from '../dao/CartsManager.js';
import TicketManager from '../dao/TicketManager.js';
import { isValidObjectId } from "mongoose";
import { io } from '../app.js';

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
        res.render('realTimeCarts', { carts: [cart] });
    } catch (error) {
        res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
    }
});

router.post('/', async (req, res) => {
    const cartId = req.cookies.cartId;
    if (!cartId) {
        return res.status(400).json({ error: `No hay un carrito asociado` });
    }        
    try {
        let cart = await CartsManager.getCartById(cid);
        if (!cart) {
            return res.status(400).json({ error: `No existe el carrito con ID ${cid}` });
        }
        let { compra, sinStock } = await CartsManager.purchase(cid);
        return res.status(200).json({ message: `Compra efectuada`, compra, sinStock });
    } catch (error) {
        res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
    }
});

export default router;
