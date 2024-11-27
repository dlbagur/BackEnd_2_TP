import CartsMongoDAO from "../DAO/cartsMongoDAO.js";
import ProductsMongoDAO from "../DAO/productsMongoDAO.js";

class CartsService {
    constructor(cartsDAO, productsDAO) {
        this.cartsDAO = cartsDAO;
        this.productsDAO = productsDAO;
    }

    async getCarts() {
        return await this.cartsDAO.getCarts();
    }

    async getCartById(cartId) {
        if (!cartId) {
            throw new Error("El ID del carrito es obligatorio");
        }
        const cart = await this.cartsDAO.getCartById(cartId);
        if (!cart) {
            throw new Error(`No se encontró un carrito con ID: ${cartId}`);
        }
        return cart;
    }

    async createCart(cartData) {
        return await this.cartsDAO.addCart(cartData);
    }

    async addProductToCart(cartId, productId) {
        if (!cartId || !productId) {
            throw new Error("El ID del carrito y del producto son obligatorios");
        }

        const product = await this.productsDAO.getProductById(productId);
        if (!product || product.stock <= 0) {
            throw new Error(`El producto con ID ${productId} no está disponible o no tiene stock`);
        }

        return await this.cartsDAO.addProductToCart(cartId, productId);
    }

    async purchaseCart(cartId) {
        if (!cartId) {
            throw new Error("El ID del carrito es obligatorio");
        }

        const cart = await this.cartsDAO.getCartById(cartId);
        if (!cart) {
            throw new Error(`No se encontró un carrito con ID: ${cartId}`);
        }

        const { compra, sinStock } = await this.cartsDAO.purchase(cartId);
        if (compra.length === 0) {
            throw new Error("No se pudo procesar la compra: todos los productos están fuera de stock");
        }

        return { compra, sinStock };
    }

    async deleteProductFromCart(cartId, productId) {
        if (!cartId || !productId) {
            throw new Error("El ID del carrito y del producto son obligatorios");
        }

        return await this.cartsDAO.deleteProductFromCart(cartId, productId);
    }

    async deleteAllProductsFromCart(cartId) {
        if (!cartId) {
            throw new Error("El ID del carrito es obligatorio");
        }

        return await this.cartsDAO.deleteAllProductsFromCart(cartId);
    }
}

export const cartsService = new CartsService(CartsMongoDAO, ProductsMongoDAO);
