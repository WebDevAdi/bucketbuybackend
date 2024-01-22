import express from 'express';
import { addProduct, createSellerAccount, deleteSelectedProduct, getSellerAllProduct, sellerLogin,sellerLogout, getCurrentSeller } from '../controllers/seller.controller.js';
import upload from '../middlewares/multer.middleware.js';
import verifySeller from '../middlewares/verifySeller.middleware.js';

const router = express.Router()


router.route('/createSellerAccount').post(upload.single('profilePhoto'),createSellerAccount)

router.route('/login').post(sellerLogin)

router.route('/addProduct').post(verifySeller,addProduct)

router.route('/sellerLogout').post(verifySeller,sellerLogout)

router.route('/getSellerProducts').get(verifySeller,getSellerAllProduct)

router.route('/getCurrentSeller').get(verifySeller,getCurrentSeller)

router.route('/deleteSelectedProduct').delete(verifySeller,deleteSelectedProduct)

export default router;