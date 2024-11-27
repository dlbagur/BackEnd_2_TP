import { isValidObjectId } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ticketsModelo } from '../DAO/models/ticketsModel.js';
import CartsMongoDAO from '../DAO/cartsMongoDAO.js';

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
            return res.status(200).json({ cart });
        } catch (error) {
            res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
        }
    };

    static getCartById = async (req, res) => {
        let { cid } = req.params;
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: `ID con formato inválido` });
        }
        try {
            let cart = await CartsMongoDAO.getCartById(cid);
            if (!cart) {
                return res.status(400).json({ error: `No existe el carrito con ID ${cid}` });
            }
            return res.status(200).json({ cart });
        } catch (error) {
            res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
        }
    };

    static postCartPurchase = async (req, res) => {
        let { cid } = req.params;
        console.log("req.params en purchase: ", req.params);
    
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: `ID de carrito con formato inválido` });
        }
    
        try {
            let cart = await CartsMongoDAO.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ error: `No existe el carrito con ID ${cid}` });
            }
    
            let compra = [];
            let sinStock = [];
    
            for (const item of cart.productos) {
                const producto = item.producto;
                const cantidadEnCarrito = item.quantity;
    
                if (producto.stock > 0) {
                    const cantidadComprada = Math.min(cantidadEnCarrito, producto.stock);
                    const cantidadFaltante = cantidadEnCarrito - cantidadComprada;
    
                    compra.push({
                        producto: producto._id,
                        nombre: producto.title,
                        price: producto.price,
                        quantity: cantidadComprada,
                    });
    
                    producto.stock -= cantidadComprada;
                    await producto.save();
    
                    if (cantidadFaltante > 0) {
                        sinStock.push({
                            producto: producto._id,
                            nombre: producto.title,
                            quantityRequested: cantidadEnCarrito,
                            availableStock: producto.stock,
                            missingQuantity: cantidadFaltante,
                        });
    
                        item.quantity = cantidadFaltante;
                    } else {
                        item.comprado = true;
                    }
                } else {
                    sinStock.push({
                        producto: producto._id,
                        nombre: producto.title,
                        quantityRequested: cantidadEnCarrito,
                        availableStock: 0,
                        missingQuantity: cantidadEnCarrito,
                    });
    
                    item.quantity = cantidadEnCarrito;
                    item.comprado = false;
                }
            }
    
            // Si no hay productos comprados, envío mensaje de error
            if (compra.length === 0) {
                return res.status(400).json({
                    error: `No se puede procesar la compra: no hay productos disponibles en el carrito.`,
                    sinStock,
                });
            }
    
            // Actualizo el carrito con productos no entregados
            cart.productos = cart.productos.filter(item => item.quantity > 0 && !item.comprado);
            await cart.save();
    
            return res.status(200).json({
                message: `Compra procesada`,
                compra,
                sinStock,
            });
        } catch (error) {
            console.error("Error en purchase: ", error);
            return res.status(500).json({
                error: `Error inesperado en el servidor: ${error.message}`,
            });
        }
    };

    static postPurchase = async (req, res) => {
        let { cid } = req.params;
        console.log("req.params en purchase: ", req.params);
    
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: `ID de carrito con formato inválido` });
        }
    
        try {
            let cart = await CartsMongoDAO.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ error: `No existe el carrito con ID ${cid}` });
            }
    
            let compra = [];
            let sinStock = [];
    
            for (const item of cart.productos) {
                const producto = item.producto;
                const cantidadEnCarrito = item.quantity;
    
                if (producto.stock > 0) {
                    const cantidadComprada = Math.min(cantidadEnCarrito, producto.stock);
                    const cantidadFaltante = cantidadEnCarrito - cantidadComprada;
    
                    compra.push({
                        producto: producto._id,
                        nombre: producto.title,
                        price: producto.price,
                        quantity: cantidadComprada,
                    });
    
                    producto.stock -= cantidadComprada;
                    await producto.save();
    
                    if (cantidadFaltante > 0) {
                        sinStock.push({
                            producto: producto._id,
                            nombre: producto.title,
                            quantityRequested: cantidadEnCarrito,
                            availableStock: producto.stock,
                            missingQuantity: cantidadFaltante,
                        });
    
                        item.quantity = cantidadFaltante;
                    } else {
                        item.comprado = true;
                    }
                } else {
                    sinStock.push({
                        producto: producto._id,
                        nombre: producto.title,
                        quantityRequested: cantidadEnCarrito,
                        availableStock: 0,
                        missingQuantity: cantidadEnCarrito,
                    });
    
                    item.quantity = cantidadEnCarrito;
                    item.comprado = false;
                }
            }
    
            // Si no hay productos comprados, envío mensaje de error
            if (compra.length === 0) {
                return res.status(400).json({
                    error: `No se puede procesar la compra: no hay productos disponibles en el carrito.`,
                    sinStock,
                });
            }
    
            // Actualizo el carrito con productos no entregados
            cart.productos = cart.productos.filter(item => item.quantity > 0 && !item.comprado);
            await cart.save();
    
            return res.status(200).json({
                message: `Compra procesada`,
                compra,
                sinStock,
            });
        } catch (error) {
            console.error("Error en purchase: ", error);
            return res.status(500).json({
                error: `Error inesperado en el servidor: ${error.message}`,
            });
        }
    };

    static createCart = async (req, res) => {
        try {
            const newCart = await CartsMongoDAO.addCart();
            return res.status(201).json({ cartId: newCart._id });
        } catch (error) {
            res.status(500).json({ error: 'Error creando un carrito' });
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
            return res.status(200).json({ updatedProducts });
        } catch (error) {
            res.status(500).json({ error: `Error agregando producto al carrito: ${error.message}` });
        }
    };

    static emptyCart = async (req, res) => {
        let { cid } = req.params;
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