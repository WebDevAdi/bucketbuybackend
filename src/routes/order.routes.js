import express from 'express'
import { cancelOrder, getUserAllOrders, orderProduct } from '../controllers/order.controller.js'
import verifyUser from '../middlewares/verifyUser.middleware.js'

const router = express.Router()

router.route('/newOrder').post(verifyUser,orderProduct)

router.route('/cancelOrder').post(verifyUser,cancelOrder)

router.route('/getAllOrders').post(verifyUser,getUserAllOrders)

export default router