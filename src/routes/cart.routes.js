import express from "express";
import { addToCart, removeItemFromCart, viewCartItems } from "../controllers/cart.controller.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";

const router = express.Router();

router.route('/addToCart').post(verifyUser,addToCart)

router.route('/removeItemFromCart').post(verifyUser,removeItemFromCart)

router.route('/viewCartItems').get(verifyUser,viewCartItems)

export default router;