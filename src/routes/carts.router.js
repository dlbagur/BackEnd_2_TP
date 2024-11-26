import { Router } from "express";
import CartsManager from '../DAO/cartsMongoDAO.js';
import { isValidObjectId } from "mongoose";
import { io } from '../app.js';
import { CartsController } from "../controllers/CartsController.js";

const router = Router();

router.get("/", CartsController.getCart)
router.get("/:cid", CartsController.getCartById)
router.post('/:cid/purchase', CartsController.postCartPurchase)
router.post('/purchase', CartsController.postPurchase)
router.post("/", CartsController.createCart)
router.post("/:cid/products/:pid", CartsController.addProductToCart)
router.delete("/:cid", CartsController.emptyCart)
router.delete("/:cid/products/:pid", CartsController.deleteProductFromCart)

export default router;
