import express from "express";
import { addToCart, removeItemFromCart, getUserCart, updateQuantity } from "../controllers/cart.controller.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";

const router = express.Router();

router.route('/addToCart').post(verifyUser,addToCart)

router.route('/removeItemFromCart').post(verifyUser,removeItemFromCart)

router.route('/updateQuantity').post(verifyUser,updateQuantity)

router.route('/getUserCart').get(verifyUser,getUserCart)

export default router;