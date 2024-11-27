import { Router } from "express";
import { passportCall } from "../utils.js";
import { ProductosController } from "../controllers/ProductsController.js";
import { auth } from '../middleware/auth.js';

const router = Router()

export default router;

router.use(passportCall('current'));

router.get("/", ProductosController.getProducts)
router.get("/:id", ProductosController.getProductsById)
router.post("/", auth('admin'), ProductosController.createProduct)
router.put("/:id", auth('admin'), ProductosController.updateProduct)
router.delete("/:id", auth('admin'), ProductosController.deleteProduct)
