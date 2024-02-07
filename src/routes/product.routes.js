import { Router } from "express";
import { getProductById, getProducts, getProductByUserSearch } from "../controllers/product.controller.js";


const router = Router();

router.route('/getProductById/:productId').get(getProductById)
router.route('/getProducts/:category/:subcategory').get(getProducts)
router.route('/products/search').get(getProductByUserSearch)





export default router