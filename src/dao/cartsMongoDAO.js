import mongoose, { now } from 'mongoose';
import { cartsModelo } from './models/cartsModel.js';
import { productosModelo } from './models/productsModel.js';
import { ticketsModelo } from './models/ticketsModel.js';

class CartsMongoDAO {

    static async getCarts() {
        return await cartsModelo.find()
            .populate({
                path: 'productos.producto',
                select: '-description -thumbnails'
            })
            .lean();
    }
    
    static async getCartById(cartId) {
        try {
            return await cartsModelo.findById(cartId)
                .populate({
                    path: 'productos.producto', 
                    select: '-description -thumbnails'
                });
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
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

    static async purchase(cartId) {
        let cart;
        let compra = [];
        let sinStock = [];
        try {
            cart = await cartsModelo.findById(cartId).populate('productos.producto');
            if (!cart) {
                throw new Error(`No existe un carrito con el ID ${cartId}`);
            }
        } catch (error) {
            throw new Error(`Error al recuperar el carrito: ${error.message}`);
        }
    
        for (let i = 0; i < cart.productos.length; i++) {
            try {
                let prodId = cart.productos[i].producto._id;
                let productoStock = await productosModelo.findById(prodId);
                if (!productoStock) {
                    throw new Error(`No existe producto con el ID ${prodId}`);
                }
                if (productoStock.stock >= cart.productos[i].quantity) {
                    compra.push({
                        producto: productoStock._id,
                        price: productoStock.price,
                        quantity: cart.productos[i].quantity
                    });
                    productoStock.stock -= cart.productos[i].quantity;
                    cart.productos[i].comprado = true;
                    await productoStock.save();
                } else {
                    sinStock.push(productoStock._id);
                    cart.productos[i].comprado = false;
                }
            } catch (error) {
                throw new Error(`Error al recuperar el producto: ${error.message}`);
            }
        }
    
        // Genero un ticket si hubo productos comprados
        if (compra.length > 0) {
            const total = compra.reduce((sum, item) => sum + item.quantity * item.price, 0);
            const formattedProducts = compra.map(item => ({
                product: item.producto,
                price: item.price,
                quantity: item.quantity
            }));
    
            const ticket = await ticketsModelo.create({
                purchaser: cart.usuario,
                amount: total,
                purchase_datetime: new Date(),
                products: formattedProducts
            });
            console.log('Ticket generado:', ticket);
        }
        cart.productos = cart.productos.filter(p => sinStock.includes(p.producto._id.toString()));
        await cart.save();
    
        return { compra, sinStock };
    }
    
}

export default CartsMongoDAO;
