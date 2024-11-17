import { Router } from 'express';
import ProductsManager from '../dao/ProductsManager.js';
import CartsManager from '../dao/CartsManager.js';
import { isValidObjectId } from "mongoose";
import { auth } from '../middleware/auth.js';

const router = Router();

// router.get('/',(req,res)=>{
//     res.status(200).render('home')
// })

router.get('/', async (req, res) => {
    try {
        const cartId = req.cookies.cartId || req.user?.cart || null;
        res.render('home', { cartId });
    } catch (error) {
        res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
    }
});

router.get('/login', async (req, res) => {
    try {
        res.status(200).render('login');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/registro', async (req, res) => {
    try {
        res.status(200).render('registro');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/perfil', auth, async (req, res) => {
    try {
        let usuario=req.session.usuario
        res.status(200).render('perfil', {usuario});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    let { limit, skip, sort, page, category, inStock } = req.query;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    skip = skip ? Number(skip) : (page - 1) * limit;

    let sortOptions = {};
    if (sort && (sort === 'asc' || sort === 'desc')) {
        sortOptions = { price: sort };
    }

    const filters = {};
    if (category) {
        filters.category = category;
    }
    if (inStock === 'true') {
        filters.stock = { $gt: 0 };
    }

    try {
        const products = await ProductsManager.getproductsPaginate(skip, limit, page, sortOptions, filters);
        res.render('realTimeProducts', {
            products: products.docs,
            page: products.page,
            totalPages: products.totalPages,
            hasNextPage: products.hasNextPage,
            hasPrevPage: products.hasPrevPage,
            nextPage: products.nextPage,
            prevPage: products.prevPage,
            limit: limit,
            sort: sort || '', 
            category: category || '',
            inStock: inStock || ''
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/realtimecarts', async (req, res) => {
    try {
        const carts = await CartsManager.getCarts();
        res.render('realTimeCarts', { carts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/realtimecarts/carts', async (req, res) => {
    try {
        const carts = await CartsManager.getCarts();
        res.render('realTimeCarts', { carts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/realtimecarts/carts/:cid', async (req, res) => {
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

export { router };
