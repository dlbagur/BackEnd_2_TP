// import { productService } from '../repository/Products.service.js';
// import { cartService } from '../repository/Carts.service.js';
import { isValidObjectId } from 'mongoose';
// import { procesaErrores } from '../utils.js';
import { v4 as uuidv4 } from 'uuid';
import { ticketsModelo } from '../DAO/models/ticketsModel.js';
import CartsMongoDAO from '../DAO/cartsMongoDAO.js'

export class CartsController {

    static getCart = async (req, res) => {
        
        try {
            const cartId = req.cookies.cartId;
            if (!cartId) {
                return res.status(400).json({ error: `No hay un carrito asociado` });
            }        
            let cart = await CartsMongoDAO.getCartById(cartId);
            if (!cart) {
                return res.status(400).json({ error: `No existe carrito para mostrar` });
            }
            res.render('realTimeCarts', { carts: [cart] });
        } catch (error) {
            res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
        }
    };
    
    static getCartById = async (req, res) => {
        let { cid } = req.params;
        console.log("req.param en :cid: ", req.params)
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: `ID con formato inválido` });
        }
        try {
            let cart = await CartsMongoDAO.getCartById(cid);
            if (!cart) {
                return res.status(400).json({ error: `No existe el carrito con ID ${cid}` });
            } else {
                res.render('realTimeCarts', {cart} )};
        } catch (error) {
            res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
        }
    };
    
    static postCartPurchase = async (req, res) => {
        let { cid } = req.params;
        console.log("req.param en purchase: ", req.params);
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: `ID de carrito con formato inválido` });
        }
        try {
            let cart = await CartsMongoDAO.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ error: `No existe el carrito con ID ${cid}` });
            }
    
            let { compra, sinStock } = await CartsMongoDAO.purchase(cid);
            return res.status(200).json({
                message: `Compra efectuada`,
                compra,
                sinStock,
            });
        } catch (error) {
            console.error("Error en purchase: ", error);
            res.status(500).json({
                error: `Error inesperado en el servidor: ${error.message}`,
            });
        }
    };
    
    static postPurchase = async (req, res) => {
        let { cid } = req.params;
        console.log("req.param en purchase: ", req.params)
        if (!cid) {
            return res.status(400).json({ error: `No existe el ID del carrito` });
        }
        try {
            let cart = await CartsMongoDAO.getCartById(cid);
            if (!cart) {
                return res.status(400).json({ error: `No existe el carrito con ID ${cid}` });
            }
            let { compra, sinStock } = await CartsMongoDAO.purchase(cid);
            return res.status(200).json({ message: `Compra efectuada`, compra, sinStock });
        } catch (error) {
            res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
        }
    };
    
    static createCart = async (req, res) => {
        try {
          const newCart = await CartsMongoDAO.addCart();
          res.status(201).json({ cartId: newCart._id });
        } catch (error) {
          res.status(500).json({ error: 'Error creando un carrito' })
        }
      };
      
    static addProductToCart = async (req, res) => {
        const { cid, pid } = req.params;
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: `ID de CART con formato inválido` });
        }
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: `ID de PRODUCTO con formato inválido` });
        }
        try {
            const updatedProducts = await CartsMongoDAO.addProductToCart(cid, pid);
            res.json(updatedProducts);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            return res.status(500).json({ error: `Error agregando producto al carrito: ${error.message}` });
        }
    };
    
    static emptyCart = async (req, res) => {
        let { cid } = req.params;
        console.log("req.param en :cid/: ", req.params)
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: `ID con formato inválido` });
        }
        try {
            let cart = await CartsMongoDAO.getCartById(cid);
            if (!cart) {
                return res.status(400).json({ error: `No existe el carrito con ID ${cid}` });
            }
            let cartEliminado = await CartsMongoDAO.deleteAllProductsFromCart(cid);
            return res.status(200).json({ message: `Carrito vaciado`, cart: cartEliminado });
        } catch (error) {
            res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
        }
    };
    
    static deleteProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: `ID del CART con formato inválido` });
        }
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: `ID del PRODUCT con formato inválido` });
        }
    
        try {
            let cart = await CartsMongoDAO.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ error: `No existe un carrito con ID ${cid}` });
            }
    
            let updatedCart = await CartsMongoDAO.deleteProductFromCart(cid, pid);
            return res.status(200).json({ message: `Producto eliminado del carrito`, cart: updatedCart });
        } catch (error) {
            res.status(500).json({ error: `Error: ${error.message}` });
        }
    };
}