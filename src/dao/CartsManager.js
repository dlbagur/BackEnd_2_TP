import mongoose from 'mongoose';
import { cartsModelo } from './models/cartsModel.js';
import { productosModelo } from './models/productsModel.js';

class CartsManager {

    static async getCarts() {
        return await cartsModelo.find()
            .populate('productos.producto')
            .lean();
    }
    
    static async getCartById(cartId) {
        return await cartsModelo.findById(cartId)
            .populate('productos.producto')
            .lean();
    }

    static async addCart(cart = {}) {
        let nuevoCart = await cartsModelo.create(cart);
        return nuevoCart; 
    }

    static async getCartProducts(cartId) {
        let cart
        try {
            cart = await this.getCart(cartId);
            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }
            } catch (error) {
            throw new Error(`Error recuperando el carrito: ${error.message}`);
        }
        return cart.products;
    }

    static async addProductToCart(cartId, prodId) {
        let cart;
        try {
            cart = await cartsModelo.findById(cartId);
            if (!cart) {
                throw new Error(`No existe un carrito con el ID ${cartId}`);
            }
        } catch (error) {
            throw new Error(`Error al recuperar el carrito: ${error.message}`);
        }

        let productoExistente;
        try {
            productoExistente = await productosModelo.findById(prodId);
            if (!productoExistente) {
                throw new Error(`No existe producto con el ID ${prodId}`);
            }
        } catch (error) {
            throw new Error(`Error al recuperar el producto: ${error.message}`);
        }

        const productoIndex = cart.productos.findIndex(p => p.producto.toString() === prodId);

        if (productoIndex === -1) {
            if (productoExistente.stock < 1) {
                throw new Error(`No hay stock suficiente del producto con ID ${prodId}`);
            } else {
                cart.productos.push({ producto: new mongoose.Types.ObjectId(prodId), quantity: 1 });
            }
        } else {
            if (productoExistente.stock - cart.productos[productoIndex].quantity < 1) {
                throw new Error(`No hay stock suficiente del producto con ID ${prodId}`);
            } else {
                cart.productos[productoIndex].quantity += 1;
            }
        }

        await cart.save();
        return cart.productos;
    }

    static async deleteProductFromCart(cartId, productId) {
        let cart = await cartsModelo.findById(cartId);
        if (!cart) {
            throw new Error(`No existe un carrito con el ID ${cartId}`);
        }
    
        const productoEnCarrito = cart.productos.find(p => p.producto.toString() === productId);
        if (!productoEnCarrito) {
            throw new Error(`El producto con el ID ${productId} no existe en el carrito`);
        }
    
        cart.productos = cart.productos.filter(p => p.producto.toString() !== productId);
        await cart.save();
        return cart;
    }

    static async deleteAllProductsFromCart(cartId) {
        let cart = await cartsModelo.findById(cartId);
        if (!cart) {
            throw new Error(`No existe un carrito con el ID ${cartId}`);
        }
        cart.productos = [];
        await cart.save();
        return cart;
    }
}

export default CartsManager;
