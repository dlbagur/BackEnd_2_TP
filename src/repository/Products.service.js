import ProductsMongoDAO from "../DAO/productsMongoDAO.js";

class ProductsService {
    constructor(DAO) {
        this.productsDAO = DAO;
    }

    async getProducts() {
        return await this.productsDAO.getProducts();
    }

    async getProductById(id) {
        if (!id) {
            throw new Error("El ID del producto es obligatorio");
        }
        const product = await this.productsDAO.getProductById(id);
        if (!product) {
            throw new Error(`No se encontró el producto con ID: ${id}`);
        }
        return product;
    }

    async createProduct(productData) {
        const { title, description, code, price, stock, category } = productData;

        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            throw new Error(
                "Es obligatorio completar los campos title, description, code, price, stock y category"
            );
        }

        if (isNaN(price) || price < 0) {
            throw new Error("El campo PRICE debe ser un número mayor o igual a 0");
        }

        if (isNaN(stock) || stock < 0) {
            throw new Error("El campo STOCK debe ser un número mayor o igual a 0");
        }

        const categoriasValidas = ["Tintos", "Blancos", "Rosados", "Espumantes"];
        if (!categoriasValidas.includes(category)) {
            throw new Error(`Las categorías válidas son: "Tintos", "Blancos", "Rosados" o "Espumantes"`);
        }

        const existe = await this.productsDAO.getProductBy({ code });
        if (existe) {
            throw new Error(`Ya existe un producto con el código ${code}`);
        }

        const nuevoProducto = await this.productsDAO.addproduct({
            ...productData,
            status: true,
            thumbnails: [],
        });
        return nuevoProducto;
    }

    async updateProduct(id, updates) {
        if (!id) {
            throw new Error("El ID del producto es obligatorio");
        }

        if (updates.price !== undefined) {
            updates.price = Number(updates.price);
            if (isNaN(updates.price) || updates.price < 0) {
                throw new Error("El campo PRICE debe ser un número mayor o igual a 0");
            }
        }

        if (updates.stock !== undefined) {
            updates.stock = Number(updates.stock);
            if (isNaN(updates.stock) || updates.stock < 0) {
                throw new Error("El campo STOCK debe ser un número mayor o igual a 0");
            }
        }

        const categoriasValidas = ["Tintos", "Blancos", "Rosados", "Espumantes"];
        if (updates.category && !categoriasValidas.includes(updates.category)) {
            throw new Error(`Las categorías válidas son: "Tintos", "Blancos", "Rosados" o "Espumantes"`);
        }

        const productoModificado = await this.productsDAO.updateproduct(id, updates);
        if (!productoModificado) {
            throw new Error(`No se encontró el producto con ID: ${id}`);
        }
        return productoModificado;
    }

    async deleteProduct(id) {
        if (!id) {
            throw new Error("El ID del producto es obligatorio");
        }

        const productoEliminado = await this.productsDAO.deleteproduct(id);
        if (!productoEliminado) {
            throw new Error(`No se encontró el producto con ID: ${id}`);
        }
        return productoEliminado;
    }
}

export const productsService = new ProductsService(ProductsMongoDAO);
