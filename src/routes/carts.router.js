import { Router } from "express";
import { CartsController } from "../controllers/CartsController.js";
import { auth } from '../middleware/auth.js'
import { passportCall } from "../utils.js";

const router = Router();

router.post("/", CartsController.createCart)
router.get("/:cid", passportCall('current'), CartsController.getCartById)
router.post('/:cid/purchase', passportCall('current'), CartsController.postCartPurchase)
router.post('/purchase', passportCall('current'), CartsController.postPurchase)
router.get("/", passportCall('current'), CartsController.getCart)
router.post("/:cid/products/:pid", passportCall('current'), CartsController.addProductToCart)
router.delete("/:cid", passportCall('current'), CartsController.emptyCart)
router.delete("/:cid/products/:pid", passportCall('current'), CartsController.deleteProductFromCart)

export default router;
