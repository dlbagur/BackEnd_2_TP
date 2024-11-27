import { productosModelo } from "./models/productsModel.js";

class ProductsMongoDAO {

    static async getProducts() {
        //   return await productosModelo.find().lean()
          return await productosModelo.find({}, "-description -thumbnails").lean();
    }

    static async getproductsPaginate(skip, limit, page, sortOptions = {}, filters = {}) {
        const options = {
          limit: limit || 10,
          page: page || 1,
          sort: sortOptions,
          lean: true,
          offset: skip
        };
        return await productosModelo.paginate(filters, options);
    }

    static async getProductById(filtro={}){
        return await productosModelo.findById(filtro).lean()
    }

    static async getProductBy(filtro={}){
        return await productosModelo.findOne(filtro).lean()
    }

    static async getProductByCode(nombre={}){
        return await productosModelo.find({code:nombre})
    }

    static async createProduct(producto){
        return productosModelo.create(producto)
    }
    
    static async addproduct(producto = {}) {
        let nuevoProducto = await productosModelo.create(producto)
        return nuevoProducto; 
    }

    static async updateproduct(id, updates) {
        try {
            const product = await productosModelo.findByIdAndUpdate(
                id, 
                updates, 
                { new: true }
            ).select('-description -thumbnails');
            return product;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }
    
    static async deleteproduct(id) {
        return await productosModelo.findByIdAndDelete(id, {new:true}).lean()
    }
}

export default ProductsMongoDAO;
