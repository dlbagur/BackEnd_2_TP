import { Router } from "express";
import { CartsController } from "../controllers/CartsController.js";

const router = Router();

router.get("/", CartsController.getCarts);
router.get("/:cid", CartsController.getCartById);
router.post("/", CartsController.createCart);
router.post("/:cid/products/:pid", CartsController.addProductToCart);
router.post("/:cid/purchase", CartsController.purchaseCart);
router.delete("/:cid/products/:pid", CartsController.deleteProductFromCart);
router.delete("/:cid", CartsController.deleteAllProductsFromCart);

export default router;
