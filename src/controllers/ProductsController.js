import productsMongoDAO from "../DAO/productsMongoDAO.js";
import { isValidObjectId } from "mongoose";

const categoriasValidas = ["Tintos", "Blancos", "Rosados", "Espumantes"];

export class ProductosController {
    static getProducts = async (req, res) => {
        try {
            const products = await productsMongoDAO.getProducts();
            res.status(200).json({ products });
        } catch (error) {
            res.status(500).json({
                error: "Error inesperado en el servidor. Intente más tarde.",
                detalle: error.message,
            });
        }
    };

    static getProductsById = async (req, res) => {
        let { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "ID con formato inválido" });
        }
        try {
            let product = await productsMongoDAO.getProductById(id);
            if (!product) {
                return res.status(400).json({ error: `No existe un producto con ID ${id}` });
            } else {
                return res.status(200).json({ product });
            }
        } catch (error) {
            return res.status(500).json({
                error: "Error inesperado en el servidor. Intente más tarde.",
                detalle: error.message,
            });
        }
    };

    static createProduct = async (req, res) => {
        let { code, category, title, description, price, stock, status, thumbnails, ...otros } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({
                error: "Es obligatorio completar los campos title, description, code, price, stock y category",
            });
        }

        price = Number(price);
        if (isNaN(price) || price < 0) {
            return res.status(400).json({ error: "El campo PRICE debe ser un número mayor o igual a 0" });
        }

        stock = Number(stock);
        if (isNaN(stock) || stock < 0) {
            return res.status(400).json({ error: "El campo STOCK debe ser un número mayor o igual a 0" });
        }

        if (!categoriasValidas.includes(category)) {
            return res.status(400).json({
                error: `Las categorías válidas son: "Tintos", "Blancos", "Rosados" o "Espumantes"`,
            });
        }

        status = true;
        thumbnails = [];

        try {
            const existe = await productsMongoDAO.getProductBy({ code });
            if (existe) {
                return res.status(400).json({ error: `Ya existe un producto con el código ${code}` });
            }

            const newProd = await productsMongoDAO.addproduct({
                code,
                category,
                title,
                description,
                price,
                stock,
                status,
                thumbnails,
                ...otros,
            });

            return res.status(201).json({ newProd });
        } catch (error) {
            return res.status(500).json({
                error: "Error inesperado al agregar el producto. Intente más tarde.",
                detalle: error.message,
            });
        }
    };

    static updateProduct = async (req, res) => {
        let { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "ID con formato inválido" });
        }

        try {
            const producto = await productsMongoDAO.getProductById(id);
            if (!producto) {
                return res.status(400).json({ error: `No existe producto con ID: ${id}` });
            }

            let aModificar = req.body;
            if (aModificar.price) {
                aModificar.price = Number(aModificar.price);
                if (isNaN(aModificar.price) || aModificar.price < 0) {
                    return res.status(400).json({ error: "El campo PRICE debe ser un número mayor o igual a 0" });
                }
            }

            if (aModificar.stock) {
                aModificar.stock = Number(aModificar.stock);
                if (isNaN(aModificar.stock) || aModificar.stock < 0) {
                    return res.status(400).json({ error: "El campo STOCK debe ser un número mayor o igual a 0" });
                }
            }

            if (aModificar.category && !categoriasValidas.includes(aModificar.category)) {
                return res.status(400).json({
                    error: `Las categorías válidas son: "Tintos", "Blancos", "Rosados" o "Espumantes"`,
                });
            }

            const productModificado = await productsMongoDAO.updateproduct(id, aModificar);

            return res.status(200).json({ productModificado });
        } catch (error) {
            return res.status(500).json({
                error: "Error inesperado al actualizar producto. Intente más tarde.",
                detalle: error.message,
            });
        }
    };

    static deleteProduct = async (req, res) => {
        let { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: `ID inválido ${id}` });
        }

        try {
            const productoExiste = await productsMongoDAO.getProductById(id);
            if (!productoExiste) {
                return res.status(400).json({ error: `No existe el producto con ID: ${id}` });
            }

            const productoEliminado = await productsMongoDAO.deleteproduct(id);

            return res.status(200).json({ productoEliminado });
        } catch (error) {
            return res.status(500).json({
                error: "Error inesperado al eliminar producto. Intente más tarde.",
                detalle: error.message,
            });
        }
    };
}