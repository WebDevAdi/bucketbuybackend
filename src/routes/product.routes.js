import { Router } from "express";
import { getProductById, getProducts } from "../controllers/product.controller.js";


const router = Router();

router.route('/getProductById/:productId').get(getProductById)
router.route('/getProducts/:category/:subcategory').get(getProducts)





export default router