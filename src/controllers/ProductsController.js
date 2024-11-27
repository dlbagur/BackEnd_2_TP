import { productsService } from "../repository/Products.service.js";

export class ProductsController {
    static async getProducts(req, res) {
        try {
            const products = await productsService.getProducts();
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getProductById(req, res) {
        try {
            const product = await productsService.getProductById(req.params.id);
            return res.status(200).json(product);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async createProduct(req, res) {
        try {
            const newProduct = await productsService.createProduct(req.body);
            return res.status(201).json(newProduct);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async updateProduct(req, res) {
        try {
            const updatedProduct = await productsService.updateProduct(req.params.id, req.body);
            return res.status(200).json(updatedProduct);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async deleteProduct(req, res) {
        try {
            const deletedProduct = await productsService.deleteProduct(req.params.id);
            return res.status(200).json(deletedProduct);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
