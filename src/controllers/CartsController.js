import { cartsService } from "../repository/Carts.service.js";

export class CartsController {
    static async getCarts(req, res) {
        try {
            const carts = await cartsService.getCarts();
            return res.status(200).json(carts);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getCartById(req, res) {
        try {
            const cart = await cartsService.getCartById(req.params.cid);
            return res.status(200).json(cart);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async createCart(req, res) {
        try {
            const newCart = await cartsService.createCart(req.body);
            return res.status(201).json(newCart);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await cartsService.addProductToCart(cid, pid);
            return res.status(200).json(updatedCart);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const result = await cartsService.purchaseCart(cid);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async deleteProductFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await cartsService.deleteProductFromCart(cid, pid);
            return res.status(200).json(updatedCart);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async deleteAllProductsFromCart(req, res) {
        try {
            const { cid } = req.params;
            const updatedCart = await cartsService.deleteAllProductsFromCart(cid);
            return res.status(200).json(updatedCart);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
