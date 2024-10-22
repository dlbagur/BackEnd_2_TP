import { Router } from "express";
import CartsManager from '../dao/CartsManager.js';
import { isValidObjectId } from "mongoose";
import { io } from '../app.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let carts = await CartsManager.getCarts();
        if (!carts || carts.length === 0) {
            return res.status(400).json({ error: `No existen carritos para mostrar` });
        }
        res.render('realTimeCarts', { carts });
    } catch (error) {
        res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
    }
});

router.get('/:cid', async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: `ID con formato inválido` });
    }
    try {
        let cart = await CartsManager.getCartById(cid);
        if (!cart) {
            return res.status(400).json({ error: `No existe el carrito con ID ${cid}` });
        } else {
            res.render('realTimeCarts', {cart} )};
    } catch (error) {
        res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
    }
});

router.post('/', async (req, res) => {
    try {
      const newCart = await CartsManager.addCart();
      res.status(201).json({ cartId: newCart._id });
    } catch (error) {
      res.status(500).json({ error: 'Error creando un carrito' })
    }
  });
  
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: `ID de CART con formato inválido` });
    }
    if (!isValidObjectId(pid)) {
        return res.status(400).json({ error: `ID de PRODUCTO con formato inválido` });
    }
    try {
        const updatedProducts = await CartsManager.addProductToCart(cid, pid);
        res.json(updatedProducts);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        return res.status(500).json({ error: `Error agregando producto al carrito: ${error.message}` });
    }
});

router.delete('/:cid/', async (req, res) => {
    let { cid } = req.params;
    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: `ID con formato inválido` });
    }
    try {
        let cart = await CartsManager.getCartById(cid);
        if (!cart) {
            return res.status(400).json({ error: `No existe el carrito con ID ${cid}` });
        }
        let cartEliminado = await CartsManager.deleteAllProductsFromCart(cid);
        return res.status(200).json({ message: `Carrito vaciado`, cart: cartEliminado });
    } catch (error) {
        res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    if (!isValidObjectId(cid)) {
        return res.status(400).json({ error: `ID del CART con formato inválido` });
    }
    if (!isValidObjectId(pid)) {
        return res.status(400).json({ error: `ID del PRODUCT con formato inválido` });
    }

    try {
        let cart = await CartsManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: `No existe un carrito con ID ${cid}` });
        }

        let updatedCart = await CartsManager.deleteProductFromCart(cid, pid);
        return res.status(200).json({ message: `Producto eliminado del carrito`, cart: updatedCart });
    } catch (error) {
        res.status(500).json({ error: `Error: ${error.message}` });
    }
});

export default router;
